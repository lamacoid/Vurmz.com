#!/usr/bin/env python3
"""
Premium Button Animations for Web - Blender Python Script

Creates glass button hover/click animations and exports them as Lottie-compatible formats.

Usage:
    /Applications/Blender.app/Contents/MacOS/Blender --background --python create-button-animations.py

Animations created:
    1. Glass Button Hover - Subtle glow intensifies, slight lift (3D feel)
    2. Glass Button Press - Quick compress and bounce back
    3. CTA Button Shine - Animated light sweep across button surface
    4. Icon Morph - Smooth transition between two states

Color scheme:
    - Teal: #6a8c8c
    - Sky Blue: #8caec4
"""

import bpy
import math
import json
import os
from mathutils import Vector, Color

# Configuration
OUTPUT_DIR = "/Users/zacharydemillo/Desktop/WEBSITE PROJECT/public/animations/"
FPS = 60

# Color scheme (hex to RGB normalized)
TEAL = (0.416, 0.549, 0.549, 1.0)  # #6a8c8c
SKY_BLUE = (0.549, 0.682, 0.769, 1.0)  # #8caec4
GLASS_BASE = (0.9, 0.95, 1.0, 0.3)  # Slightly blue-tinted glass


def hex_to_rgb(hex_color):
    """Convert hex color to RGB tuple (0-1 range)."""
    hex_color = hex_color.lstrip('#')
    r = int(hex_color[0:2], 16) / 255.0
    g = int(hex_color[2:4], 16) / 255.0
    b = int(hex_color[4:6], 16) / 255.0
    return (r, g, b, 1.0)


def clear_scene():
    """Remove all objects from the scene."""
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)

    # Clear all materials
    for material in bpy.data.materials:
        bpy.data.materials.remove(material)

    # Clear all animations
    for action in bpy.data.actions:
        bpy.data.actions.remove(action)


def setup_render_settings(frame_count):
    """Configure render settings for web animation export."""
    scene = bpy.context.scene
    scene.render.engine = 'CYCLES'
    scene.cycles.device = 'CPU'  # Use CPU for compatibility
    scene.cycles.samples = 64  # Lower for faster render, still good quality

    scene.render.resolution_x = 256
    scene.render.resolution_y = 128
    scene.render.resolution_percentage = 100
    scene.render.film_transparent = True  # Transparent background

    scene.frame_start = 1
    scene.frame_end = frame_count
    scene.render.fps = FPS

    # Output settings for video (can be converted to Lottie)
    scene.render.image_settings.file_format = 'PNG'
    scene.render.image_settings.color_mode = 'RGBA'


def create_glass_material(name, base_color=GLASS_BASE, emission_strength=0.0):
    """Create a premium glass material with optional emission."""
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links

    # Clear default nodes
    nodes.clear()

    # Create nodes
    output = nodes.new('ShaderNodeOutputMaterial')
    output.location = (400, 0)

    mix_shader = nodes.new('ShaderNodeMixShader')
    mix_shader.location = (200, 0)
    mix_shader.inputs[0].default_value = 0.5

    glass_bsdf = nodes.new('ShaderNodeBsdfGlass')
    glass_bsdf.location = (0, 100)
    glass_bsdf.inputs['Color'].default_value = base_color
    glass_bsdf.inputs['Roughness'].default_value = 0.1
    glass_bsdf.inputs['IOR'].default_value = 1.45

    emission = nodes.new('ShaderNodeEmission')
    emission.location = (0, -100)
    emission.inputs['Color'].default_value = SKY_BLUE
    emission.inputs['Strength'].default_value = emission_strength

    # Link nodes
    links.new(glass_bsdf.outputs['BSDF'], mix_shader.inputs[1])
    links.new(emission.outputs['Emission'], mix_shader.inputs[2])
    links.new(mix_shader.outputs['Shader'], output.inputs['Surface'])

    return mat


def create_button_mesh(width=2.0, height=0.6, depth=0.2, corner_radius=0.15):
    """Create a rounded rectangle button shape."""
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 0))
    button = bpy.context.active_object
    button.scale = (width, height, depth)
    bpy.ops.object.transform_apply(scale=True)

    # Add bevel for rounded corners
    bevel = button.modifiers.new(name="Bevel", type='BEVEL')
    bevel.width = corner_radius
    bevel.segments = 8
    bevel.limit_method = 'ANGLE'

    # Add subdivision for smoothness
    subsurf = button.modifiers.new(name="Subdivision", type='SUBSURF')
    subsurf.levels = 2
    subsurf.render_levels = 2

    return button


def setup_lighting():
    """Create studio lighting for glass effects."""
    # Key light (front-top)
    bpy.ops.object.light_add(type='AREA', location=(2, -3, 4))
    key_light = bpy.context.active_object
    key_light.name = "KeyLight"
    key_light.data.energy = 100
    key_light.data.size = 3
    key_light.data.color = (1.0, 0.98, 0.95)

    # Fill light (left side)
    bpy.ops.object.light_add(type='AREA', location=(-3, -2, 2))
    fill_light = bpy.context.active_object
    fill_light.name = "FillLight"
    fill_light.data.energy = 50
    fill_light.data.size = 2
    fill_light.data.color = SKY_BLUE[:3]

    # Rim light (back)
    bpy.ops.object.light_add(type='AREA', location=(0, 3, 1))
    rim_light = bpy.context.active_object
    rim_light.name = "RimLight"
    rim_light.data.energy = 30
    rim_light.data.size = 4
    rim_light.data.color = TEAL[:3]

    return [key_light, fill_light, rim_light]


def setup_camera():
    """Position camera for button view."""
    bpy.ops.object.camera_add(location=(0, -5, 2))
    camera = bpy.context.active_object
    camera.name = "ButtonCamera"

    # Point at origin
    camera.rotation_euler = (math.radians(70), 0, 0)

    bpy.context.scene.camera = camera
    return camera


def ease_in_out_cubic(t):
    """Cubic ease-in-out function for smooth animations."""
    if t < 0.5:
        return 4 * t * t * t
    else:
        return 1 - pow(-2 * t + 2, 3) / 2


def ease_out_elastic(t):
    """Elastic ease-out for bouncy effects."""
    c4 = (2 * math.pi) / 3
    if t == 0:
        return 0
    elif t == 1:
        return 1
    else:
        return pow(2, -10 * t) * math.sin((t * 10 - 0.75) * c4) + 1


def create_glass_button_hover_animation():
    """
    Animation 1: Glass Button Hover
    - Subtle glow intensifies
    - Slight lift (3D feel)
    - 45 frames at 60fps (0.75 seconds)
    """
    print("Creating Glass Button Hover animation...")
    clear_scene()

    frame_count = 45
    setup_render_settings(frame_count)

    # Create button
    button = create_button_mesh()
    button.name = "GlassButton"

    # Create animated glass material
    mat = create_glass_material("GlassHoverMaterial", emission_strength=0.0)
    button.data.materials.append(mat)

    # Get emission node for animation
    emission_node = mat.node_tree.nodes.get("Emission")
    mix_node = mat.node_tree.nodes.get("Mix Shader")

    # Setup lighting and camera
    setup_lighting()
    setup_camera()

    # Animate: Hover in (frames 1-15), Hold (15-30), Hover out (30-45)
    # Position animation (lift effect)
    button.location.z = 0
    button.keyframe_insert(data_path="location", frame=1, index=2)

    button.location.z = 0.15  # Lifted
    button.keyframe_insert(data_path="location", frame=15, index=2)
    button.keyframe_insert(data_path="location", frame=30, index=2)

    button.location.z = 0
    button.keyframe_insert(data_path="location", frame=45, index=2)

    # Emission animation (glow intensifies)
    emission_node.inputs['Strength'].default_value = 0.0
    emission_node.inputs['Strength'].keyframe_insert(data_path="default_value", frame=1)

    emission_node.inputs['Strength'].default_value = 0.8
    emission_node.inputs['Strength'].keyframe_insert(data_path="default_value", frame=15)
    emission_node.inputs['Strength'].keyframe_insert(data_path="default_value", frame=30)

    emission_node.inputs['Strength'].default_value = 0.0
    emission_node.inputs['Strength'].keyframe_insert(data_path="default_value", frame=45)

    # Mix factor animation (more glass to emission blend)
    mix_node.inputs[0].default_value = 0.1
    mix_node.inputs[0].keyframe_insert(data_path="default_value", frame=1)

    mix_node.inputs[0].default_value = 0.4
    mix_node.inputs[0].keyframe_insert(data_path="default_value", frame=15)
    mix_node.inputs[0].keyframe_insert(data_path="default_value", frame=30)

    mix_node.inputs[0].default_value = 0.1
    mix_node.inputs[0].keyframe_insert(data_path="default_value", frame=45)

    # Set easing on all keyframes
    for fc in button.animation_data.action.fcurves:
        for kf in fc.keyframe_points:
            kf.interpolation = 'BEZIER'
            kf.easing = 'EASE_IN_OUT'

    # Export
    export_animation("glass-button-hover", frame_count)
    generate_lottie_json("glass-button-hover", frame_count, "hover")


def create_glass_button_press_animation():
    """
    Animation 2: Glass Button Press
    - Quick compress and bounce back
    - 30 frames at 60fps (0.5 seconds)
    """
    print("Creating Glass Button Press animation...")
    clear_scene()

    frame_count = 30
    setup_render_settings(frame_count)

    # Create button
    button = create_button_mesh()
    button.name = "GlassButtonPress"

    # Create glass material with teal tint
    mat = create_glass_material("GlassPressedMaterial", base_color=(*TEAL[:3], 0.4))
    button.data.materials.append(mat)

    emission_node = mat.node_tree.nodes.get("Emission")

    # Setup
    setup_lighting()
    setup_camera()

    # Animation keyframes
    # Press down (frames 1-8)
    button.scale = (1.0, 1.0, 1.0)
    button.keyframe_insert(data_path="scale", frame=1)
    button.location.z = 0
    button.keyframe_insert(data_path="location", frame=1, index=2)

    # Compressed state (frame 8)
    button.scale = (1.05, 1.05, 0.7)  # Squash
    button.keyframe_insert(data_path="scale", frame=8)
    button.location.z = -0.05
    button.keyframe_insert(data_path="location", frame=8, index=2)

    # Bounce overshoot (frame 15)
    button.scale = (0.97, 0.97, 1.08)  # Stretch
    button.keyframe_insert(data_path="scale", frame=15)
    button.location.z = 0.08
    button.keyframe_insert(data_path="location", frame=15, index=2)

    # Settle bounce (frame 22)
    button.scale = (1.01, 1.01, 0.98)
    button.keyframe_insert(data_path="scale", frame=22)
    button.location.z = -0.02
    button.keyframe_insert(data_path="location", frame=22, index=2)

    # Rest position (frame 30)
    button.scale = (1.0, 1.0, 1.0)
    button.keyframe_insert(data_path="scale", frame=30)
    button.location.z = 0
    button.keyframe_insert(data_path="location", frame=30, index=2)

    # Flash on press
    emission_node.inputs['Strength'].default_value = 0.0
    emission_node.inputs['Strength'].keyframe_insert(data_path="default_value", frame=1)

    emission_node.inputs['Strength'].default_value = 1.5
    emission_node.inputs['Strength'].keyframe_insert(data_path="default_value", frame=8)

    emission_node.inputs['Strength'].default_value = 0.3
    emission_node.inputs['Strength'].keyframe_insert(data_path="default_value", frame=15)

    emission_node.inputs['Strength'].default_value = 0.0
    emission_node.inputs['Strength'].keyframe_insert(data_path="default_value", frame=30)

    # Export
    export_animation("glass-button-press", frame_count)
    generate_lottie_json("glass-button-press", frame_count, "press")


def create_cta_button_shine_animation():
    """
    Animation 3: CTA Button Shine
    - Animated light sweep across button surface
    - 60 frames at 60fps (1 second)
    """
    print("Creating CTA Button Shine animation...")
    clear_scene()

    frame_count = 60
    setup_render_settings(frame_count)

    # Create button
    button = create_button_mesh(width=2.5, height=0.7, depth=0.25)
    button.name = "CTAButton"

    # Create gradient glass material
    mat = bpy.data.materials.new(name="CTAShineGlass")
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()

    # Create shader nodes
    output = nodes.new('ShaderNodeOutputMaterial')
    output.location = (600, 0)

    mix_shader = nodes.new('ShaderNodeMixShader')
    mix_shader.location = (400, 0)

    glass_bsdf = nodes.new('ShaderNodeBsdfGlass')
    glass_bsdf.location = (0, 100)
    glass_bsdf.inputs['Color'].default_value = (*TEAL[:3], 0.5)
    glass_bsdf.inputs['Roughness'].default_value = 0.05

    emission = nodes.new('ShaderNodeEmission')
    emission.location = (0, -100)
    emission.inputs['Color'].default_value = (1.0, 1.0, 1.0, 1.0)  # White shine
    emission.inputs['Strength'].default_value = 3.0

    # Gradient for shine position
    gradient = nodes.new('ShaderNodeTexGradient')
    gradient.location = (-400, 0)
    gradient.gradient_type = 'LINEAR'

    mapping = nodes.new('ShaderNodeMapping')
    mapping.location = (-600, 0)
    mapping.inputs['Scale'].default_value = (0.5, 1, 1)

    tex_coord = nodes.new('ShaderNodeTexCoord')
    tex_coord.location = (-800, 0)

    # Color ramp for sharp shine edge
    ramp = nodes.new('ShaderNodeValToRGB')
    ramp.location = (-200, 0)
    ramp.color_ramp.elements[0].position = 0.45
    ramp.color_ramp.elements[0].color = (0, 0, 0, 1)
    ramp.color_ramp.elements[1].position = 0.5
    ramp.color_ramp.elements[1].color = (1, 1, 1, 1)

    # Add another element for sharp falloff
    ramp.color_ramp.elements.new(0.55)
    ramp.color_ramp.elements[2].color = (0, 0, 0, 1)

    # Link nodes
    links.new(tex_coord.outputs['Object'], mapping.inputs['Vector'])
    links.new(mapping.outputs['Vector'], gradient.inputs['Vector'])
    links.new(gradient.outputs['Color'], ramp.inputs['Fac'])
    links.new(ramp.outputs['Color'], mix_shader.inputs[0])
    links.new(glass_bsdf.outputs['BSDF'], mix_shader.inputs[1])
    links.new(emission.outputs['Emission'], mix_shader.inputs[2])
    links.new(mix_shader.outputs['Shader'], output.inputs['Surface'])

    button.data.materials.append(mat)

    # Setup
    setup_lighting()
    setup_camera()

    # Animate shine sweep via mapping location
    # Start off left
    mapping.inputs['Location'].default_value = (-2.0, 0, 0)
    mapping.inputs['Location'].keyframe_insert(data_path="default_value", frame=1)

    # Sweep across
    mapping.inputs['Location'].default_value = (2.0, 0, 0)
    mapping.inputs['Location'].keyframe_insert(data_path="default_value", frame=60)

    # Export
    export_animation("cta-button-shine", frame_count)
    generate_lottie_json("cta-button-shine", frame_count, "shine")


def create_icon_morph_animation():
    """
    Animation 4: Icon Morph
    - Smooth transition between two states (plus to check)
    - 45 frames at 60fps (0.75 seconds)
    """
    print("Creating Icon Morph animation...")
    clear_scene()

    frame_count = 45
    setup_render_settings(frame_count)

    # Create plus icon (two crossing bars)
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 0))
    h_bar = bpy.context.active_object
    h_bar.name = "HorizontalBar"
    h_bar.scale = (0.8, 0.15, 0.1)
    bpy.ops.object.transform_apply(scale=True)

    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 0))
    v_bar = bpy.context.active_object
    v_bar.name = "VerticalBar"
    v_bar.scale = (0.15, 0.8, 0.1)
    bpy.ops.object.transform_apply(scale=True)

    # Create glass material for icon
    mat = create_glass_material("IconGlass", base_color=(*SKY_BLUE[:3], 0.6), emission_strength=0.3)
    h_bar.data.materials.append(mat)
    v_bar.data.materials.append(mat)

    emission_node = mat.node_tree.nodes.get("Emission")

    # Setup
    setup_lighting()
    camera = setup_camera()
    camera.location = (0, -4, 1)
    camera.rotation_euler = (math.radians(80), 0, 0)

    # Animation: Plus rotates and morphs to checkmark shape
    # Frame 1: Plus icon
    h_bar.rotation_euler = (0, 0, 0)
    h_bar.keyframe_insert(data_path="rotation_euler", frame=1)
    h_bar.location = (0, 0, 0)
    h_bar.keyframe_insert(data_path="location", frame=1)
    h_bar.scale = (1, 1, 1)
    h_bar.keyframe_insert(data_path="scale", frame=1)

    v_bar.rotation_euler = (0, 0, 0)
    v_bar.keyframe_insert(data_path="rotation_euler", frame=1)
    v_bar.location = (0, 0, 0)
    v_bar.keyframe_insert(data_path="location", frame=1)
    v_bar.scale = (1, 1, 1)
    v_bar.keyframe_insert(data_path="scale", frame=1)

    # Frame 15: Spin and scale down (transition)
    h_bar.rotation_euler = (0, 0, math.radians(180))
    h_bar.keyframe_insert(data_path="rotation_euler", frame=15)
    h_bar.scale = (0.5, 0.5, 0.5)
    h_bar.keyframe_insert(data_path="scale", frame=15)

    v_bar.rotation_euler = (0, 0, math.radians(180))
    v_bar.keyframe_insert(data_path="rotation_euler", frame=15)
    v_bar.scale = (0.5, 0.5, 0.5)
    v_bar.keyframe_insert(data_path="scale", frame=15)

    # Frame 30-45: Transform to checkmark
    # Horizontal bar becomes short arm of check
    h_bar.rotation_euler = (0, 0, math.radians(-45))
    h_bar.keyframe_insert(data_path="rotation_euler", frame=30)
    h_bar.location = (-0.2, -0.1, 0)
    h_bar.keyframe_insert(data_path="location", frame=30)
    h_bar.scale = (0.5, 1, 1)
    h_bar.keyframe_insert(data_path="scale", frame=30)

    # Vertical bar becomes long arm of check
    v_bar.rotation_euler = (0, 0, math.radians(45))
    v_bar.keyframe_insert(data_path="rotation_euler", frame=30)
    v_bar.location = (0.25, 0.15, 0)
    v_bar.keyframe_insert(data_path="location", frame=30)
    v_bar.scale = (1.2, 1, 1)
    v_bar.keyframe_insert(data_path="scale", frame=30)

    # Hold final position
    h_bar.keyframe_insert(data_path="rotation_euler", frame=45)
    h_bar.keyframe_insert(data_path="location", frame=45)
    h_bar.keyframe_insert(data_path="scale", frame=45)

    v_bar.keyframe_insert(data_path="rotation_euler", frame=45)
    v_bar.keyframe_insert(data_path="location", frame=45)
    v_bar.keyframe_insert(data_path="scale", frame=45)

    # Emission pulse during morph
    emission_node.inputs['Strength'].default_value = 0.3
    emission_node.inputs['Strength'].keyframe_insert(data_path="default_value", frame=1)

    emission_node.inputs['Strength'].default_value = 1.5
    emission_node.inputs['Strength'].keyframe_insert(data_path="default_value", frame=15)

    emission_node.inputs['Strength'].default_value = 0.8
    emission_node.inputs['Strength'].keyframe_insert(data_path="default_value", frame=30)

    emission_node.inputs['Strength'].default_value = 0.3
    emission_node.inputs['Strength'].keyframe_insert(data_path="default_value", frame=45)

    # Export
    export_animation("icon-morph", frame_count)
    generate_lottie_json("icon-morph", frame_count, "morph")


def export_animation(name, frame_count):
    """Export animation as PNG sequence (can be converted to video/Lottie)."""
    output_path = os.path.join(OUTPUT_DIR, name)

    # Create directory for frames
    frames_dir = output_path + "_frames"
    os.makedirs(frames_dir, exist_ok=True)

    # Export PNG sequence
    bpy.context.scene.render.filepath = os.path.join(frames_dir, "frame_")
    bpy.ops.render.render(animation=True)

    print(f"  Exported PNG sequence to: {frames_dir}")

    # Try to export as video (WebM for web use)
    try:
        bpy.context.scene.render.image_settings.file_format = 'FFMPEG'
        bpy.context.scene.render.ffmpeg.format = 'WEBM'
        bpy.context.scene.render.ffmpeg.codec = 'WEBM'
        bpy.context.scene.render.ffmpeg.constant_rate_factor = 'HIGH'
        bpy.context.scene.render.filepath = output_path + ".webm"
        bpy.ops.render.render(animation=True)
        print(f"  Exported WebM video to: {output_path}.webm")
    except Exception as e:
        print(f"  Note: WebM export skipped ({e})")


def generate_lottie_json(name, frame_count, animation_type):
    """
    Generate a Lottie-compatible JSON file for the animation.

    This creates a simplified Lottie animation that can be used directly
    or as a template. For full Blender-to-Lottie conversion, consider:
    - Using the io_export_lottie addon
    - Converting the PNG sequence with tools like lottie-web
    - Using After Effects with Bodymovin
    """

    # Base Lottie structure
    lottie = {
        "v": "5.7.4",  # Lottie version
        "fr": FPS,
        "ip": 0,  # In point
        "op": frame_count,  # Out point
        "w": 256,
        "h": 128,
        "nm": name,
        "ddd": 0,  # 3D disabled (2D animation)
        "assets": [],
        "layers": []
    }

    # Create shape layer based on animation type
    if animation_type == "hover":
        lottie["layers"] = create_hover_lottie_layer(frame_count)
    elif animation_type == "press":
        lottie["layers"] = create_press_lottie_layer(frame_count)
    elif animation_type == "shine":
        lottie["layers"] = create_shine_lottie_layer(frame_count)
    elif animation_type == "morph":
        lottie["layers"] = create_morph_lottie_layer(frame_count)

    # Write Lottie JSON
    output_path = os.path.join(OUTPUT_DIR, f"{name}.json")
    with open(output_path, 'w') as f:
        json.dump(lottie, f, indent=2)

    print(f"  Generated Lottie JSON: {output_path}")


def create_hover_lottie_layer(frame_count):
    """Create Lottie layers for hover animation."""
    return [{
        "ddd": 0,
        "ind": 1,
        "ty": 4,  # Shape layer
        "nm": "Button",
        "sr": 1,
        "ks": {
            "o": {"a": 0, "k": 100},  # Opacity
            "r": {"a": 0, "k": 0},  # Rotation
            "p": {  # Position with animation
                "a": 1,
                "k": [
                    {"t": 0, "s": [128, 64, 0], "e": [128, 56, 0], "i": {"x": 0.5, "y": 1}, "o": {"x": 0.5, "y": 0}},
                    {"t": 15, "s": [128, 56, 0], "e": [128, 56, 0], "h": 1},
                    {"t": 30, "s": [128, 56, 0], "e": [128, 64, 0], "i": {"x": 0.5, "y": 1}, "o": {"x": 0.5, "y": 0}},
                    {"t": 45, "s": [128, 64, 0]}
                ]
            },
            "a": {"a": 0, "k": [0, 0, 0]},  # Anchor
            "s": {"a": 0, "k": [100, 100, 100]}  # Scale
        },
        "shapes": [{
            "ty": "rc",  # Rectangle
            "d": 1,
            "s": {"a": 0, "k": [180, 50]},  # Size
            "p": {"a": 0, "k": [0, 0]},
            "r": {"a": 0, "k": 12},  # Rounded corners
            "nm": "ButtonShape"
        }, {
            "ty": "fl",  # Fill
            "c": {
                "a": 1,
                "k": [
                    {"t": 0, "s": [0.416, 0.549, 0.549, 1], "e": [0.549, 0.682, 0.769, 1]},
                    {"t": 15, "s": [0.549, 0.682, 0.769, 1]},
                    {"t": 30, "s": [0.549, 0.682, 0.769, 1], "e": [0.416, 0.549, 0.549, 1]},
                    {"t": 45, "s": [0.416, 0.549, 0.549, 1]}
                ]
            },
            "o": {"a": 0, "k": 80},
            "nm": "Fill"
        }],
        "ip": 0,
        "op": frame_count,
        "st": 0
    }]


def create_press_lottie_layer(frame_count):
    """Create Lottie layers for press animation."""
    return [{
        "ddd": 0,
        "ind": 1,
        "ty": 4,
        "nm": "Button",
        "sr": 1,
        "ks": {
            "o": {"a": 0, "k": 100},
            "r": {"a": 0, "k": 0},
            "p": {"a": 0, "k": [128, 64, 0]},
            "a": {"a": 0, "k": [0, 0, 0]},
            "s": {
                "a": 1,
                "k": [
                    {"t": 0, "s": [100, 100, 100], "e": [105, 85, 100]},
                    {"t": 8, "s": [105, 85, 100], "e": [97, 108, 100], "i": {"x": 0.3, "y": 1}, "o": {"x": 0.7, "y": 0}},
                    {"t": 15, "s": [97, 108, 100], "e": [101, 98, 100]},
                    {"t": 22, "s": [101, 98, 100], "e": [100, 100, 100]},
                    {"t": 30, "s": [100, 100, 100]}
                ]
            }
        },
        "shapes": [{
            "ty": "rc",
            "d": 1,
            "s": {"a": 0, "k": [180, 50]},
            "p": {"a": 0, "k": [0, 0]},
            "r": {"a": 0, "k": 12},
            "nm": "ButtonShape"
        }, {
            "ty": "fl",
            "c": {
                "a": 1,
                "k": [
                    {"t": 0, "s": [0.416, 0.549, 0.549, 1]},
                    {"t": 8, "s": [0.549, 0.682, 0.769, 1]},
                    {"t": 30, "s": [0.416, 0.549, 0.549, 1]}
                ]
            },
            "o": {"a": 0, "k": 85},
            "nm": "Fill"
        }],
        "ip": 0,
        "op": frame_count,
        "st": 0
    }]


def create_shine_lottie_layer(frame_count):
    """Create Lottie layers for shine animation."""
    return [
        # Background button
        {
            "ddd": 0,
            "ind": 1,
            "ty": 4,
            "nm": "Button",
            "sr": 1,
            "ks": {
                "o": {"a": 0, "k": 100},
                "r": {"a": 0, "k": 0},
                "p": {"a": 0, "k": [128, 64, 0]},
                "a": {"a": 0, "k": [0, 0, 0]},
                "s": {"a": 0, "k": [100, 100, 100]}
            },
            "shapes": [{
                "ty": "rc",
                "d": 1,
                "s": {"a": 0, "k": [200, 55]},
                "p": {"a": 0, "k": [0, 0]},
                "r": {"a": 0, "k": 14},
                "nm": "ButtonShape"
            }, {
                "ty": "fl",
                "c": {"a": 0, "k": [0.416, 0.549, 0.549, 1]},
                "o": {"a": 0, "k": 80},
                "nm": "Fill"
            }],
            "ip": 0,
            "op": frame_count,
            "st": 0
        },
        # Shine overlay
        {
            "ddd": 0,
            "ind": 2,
            "ty": 4,
            "nm": "Shine",
            "sr": 1,
            "ks": {
                "o": {"a": 0, "k": 60},
                "r": {"a": 0, "k": -20},
                "p": {
                    "a": 1,
                    "k": [
                        {"t": 0, "s": [-50, 64, 0], "e": [306, 64, 0], "i": {"x": 0.5, "y": 1}, "o": {"x": 0.5, "y": 0}},
                        {"t": 60, "s": [306, 64, 0]}
                    ]
                },
                "a": {"a": 0, "k": [0, 0, 0]},
                "s": {"a": 0, "k": [100, 100, 100]}
            },
            "shapes": [{
                "ty": "rc",
                "d": 1,
                "s": {"a": 0, "k": [30, 100]},
                "p": {"a": 0, "k": [0, 0]},
                "r": {"a": 0, "k": 0},
                "nm": "ShineShape"
            }, {
                "ty": "gf",  # Gradient fill
                "o": {"a": 0, "k": 100},
                "r": 1,
                "s": {"a": 0, "k": [-15, 0]},
                "e": {"a": 0, "k": [15, 0]},
                "t": 1,
                "g": {
                    "p": 3,
                    "k": {
                        "a": 0,
                        "k": [0, 1, 1, 1, 0.5, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0.8, 1, 0]
                    }
                },
                "nm": "ShineGradient"
            }],
            "ip": 0,
            "op": frame_count,
            "st": 0,
            "hasMask": True,
            "masksProperties": [{
                "inv": False,
                "mode": "i",
                "pt": {
                    "a": 0,
                    "k": {
                        "c": True,
                        "v": [[-100, -27.5], [100, -27.5], [100, 27.5], [-100, 27.5]],
                        "i": [[0, 0], [0, 0], [0, 0], [0, 0]],
                        "o": [[0, 0], [0, 0], [0, 0], [0, 0]]
                    }
                },
                "o": {"a": 0, "k": 100}
            }]
        }
    ]


def create_morph_lottie_layer(frame_count):
    """Create Lottie layers for morph animation (plus to checkmark)."""
    return [
        # Horizontal bar (becomes short check arm)
        {
            "ddd": 0,
            "ind": 1,
            "ty": 4,
            "nm": "HBar",
            "sr": 1,
            "ks": {
                "o": {"a": 0, "k": 100},
                "r": {
                    "a": 1,
                    "k": [
                        {"t": 0, "s": [0], "e": [180]},
                        {"t": 15, "s": [180], "e": [-45]},
                        {"t": 30, "s": [-45]},
                        {"t": 45, "s": [-45]}
                    ]
                },
                "p": {
                    "a": 1,
                    "k": [
                        {"t": 0, "s": [128, 64, 0]},
                        {"t": 15, "s": [128, 64, 0]},
                        {"t": 30, "s": [108, 72, 0]},
                        {"t": 45, "s": [108, 72, 0]}
                    ]
                },
                "a": {"a": 0, "k": [0, 0, 0]},
                "s": {
                    "a": 1,
                    "k": [
                        {"t": 0, "s": [100, 100, 100]},
                        {"t": 15, "s": [50, 50, 50]},
                        {"t": 30, "s": [50, 100, 100]},
                        {"t": 45, "s": [50, 100, 100]}
                    ]
                }
            },
            "shapes": [{
                "ty": "rc",
                "d": 1,
                "s": {"a": 0, "k": [60, 12]},
                "p": {"a": 0, "k": [0, 0]},
                "r": {"a": 0, "k": 4},
                "nm": "Bar"
            }, {
                "ty": "fl",
                "c": {"a": 0, "k": [0.549, 0.682, 0.769, 1]},
                "o": {"a": 0, "k": 90},
                "nm": "Fill"
            }],
            "ip": 0,
            "op": frame_count,
            "st": 0
        },
        # Vertical bar (becomes long check arm)
        {
            "ddd": 0,
            "ind": 2,
            "ty": 4,
            "nm": "VBar",
            "sr": 1,
            "ks": {
                "o": {"a": 0, "k": 100},
                "r": {
                    "a": 1,
                    "k": [
                        {"t": 0, "s": [90]},
                        {"t": 15, "s": [270]},
                        {"t": 30, "s": [45]},
                        {"t": 45, "s": [45]}
                    ]
                },
                "p": {
                    "a": 1,
                    "k": [
                        {"t": 0, "s": [128, 64, 0]},
                        {"t": 15, "s": [128, 64, 0]},
                        {"t": 30, "s": [148, 52, 0]},
                        {"t": 45, "s": [148, 52, 0]}
                    ]
                },
                "a": {"a": 0, "k": [0, 0, 0]},
                "s": {
                    "a": 1,
                    "k": [
                        {"t": 0, "s": [100, 100, 100]},
                        {"t": 15, "s": [50, 50, 50]},
                        {"t": 30, "s": [120, 100, 100]},
                        {"t": 45, "s": [120, 100, 100]}
                    ]
                }
            },
            "shapes": [{
                "ty": "rc",
                "d": 1,
                "s": {"a": 0, "k": [60, 12]},
                "p": {"a": 0, "k": [0, 0]},
                "r": {"a": 0, "k": 4},
                "nm": "Bar"
            }, {
                "ty": "fl",
                "c": {"a": 0, "k": [0.549, 0.682, 0.769, 1]},
                "o": {"a": 0, "k": 90},
                "nm": "Fill"
            }],
            "ip": 0,
            "op": frame_count,
            "st": 0
        }
    ]


def main():
    """Main function to create all button animations."""
    print("=" * 60)
    print("Premium Button Animations Generator")
    print("=" * 60)
    print(f"Output directory: {OUTPUT_DIR}")
    print(f"Frame rate: {FPS} fps")
    print()

    # Ensure output directory exists
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    # Create all animations
    create_glass_button_hover_animation()
    print()

    create_glass_button_press_animation()
    print()

    create_cta_button_shine_animation()
    print()

    create_icon_morph_animation()
    print()

    print("=" * 60)
    print("All animations created successfully!")
    print("=" * 60)
    print()
    print("Output files:")
    print(f"  - {OUTPUT_DIR}glass-button-hover.json (Lottie)")
    print(f"  - {OUTPUT_DIR}glass-button-hover_frames/ (PNG sequence)")
    print(f"  - {OUTPUT_DIR}glass-button-press.json (Lottie)")
    print(f"  - {OUTPUT_DIR}glass-button-press_frames/ (PNG sequence)")
    print(f"  - {OUTPUT_DIR}cta-button-shine.json (Lottie)")
    print(f"  - {OUTPUT_DIR}cta-button-shine_frames/ (PNG sequence)")
    print(f"  - {OUTPUT_DIR}icon-morph.json (Lottie)")
    print(f"  - {OUTPUT_DIR}icon-morph_frames/ (PNG sequence)")
    print()
    print("To run:")
    print("  /Applications/Blender.app/Contents/MacOS/Blender --background --python create-button-animations.py")


if __name__ == "__main__":
    main()
