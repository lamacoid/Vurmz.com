#!/usr/bin/env python3
"""
VURMZ Site Animation Generator for Blender 4.3+

Creates unique animated elements for use throughout the VURMZ website:
1. Laser beam loading animation
2. Glass morphism button hover effect
3. Water droplet splash for transitions
4. Floating particles ambient effect
5. Engraving reveal animation

Run with:
    /Applications/Blender.app/Contents/MacOS/Blender --background --python scripts/blender-site-animations.py
"""

import bpy
import os
import math
import random

# Clear scene
bpy.ops.wm.read_factory_settings(use_empty=True)

# Paths
script_dir = os.path.dirname(os.path.abspath(__file__))
project_dir = os.path.dirname(script_dir)
video_dir = os.path.join(project_dir, "public", "videos")
os.makedirs(video_dir, exist_ok=True)

# VURMZ Colors
VURMZ_TEAL = (106/255, 140/255, 140/255, 1.0)
VURMZ_TEAL_DARK = (90/255, 122/255, 122/255, 1.0)
VURMZ_SKY = (140/255, 174/255, 196/255, 1.0)
VURMZ_DARK = (44/255, 53/255, 51/255, 1.0)

# Render settings
scene = bpy.context.scene
scene.render.engine = 'CYCLES'
scene.cycles.device = 'CPU'
scene.cycles.samples = 64  # Lower for faster rendering
scene.render.film_transparent = True
scene.render.fps = 30

def setup_camera_ortho(size=2):
    """Set up orthographic camera for 2D-style animations"""
    bpy.ops.object.camera_add(location=(0, -10, 0))
    cam = bpy.context.active_object
    cam.data.type = 'ORTHO'
    cam.data.ortho_scale = size
    cam.rotation_euler = (math.radians(90), 0, 0)
    scene.camera = cam
    return cam

def create_emission_material(name, color, strength=5):
    """Create glowing emission material"""
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()

    emission = nodes.new('ShaderNodeEmission')
    emission.inputs['Color'].default_value = color
    emission.inputs['Strength'].default_value = strength
    emission.location = (0, 0)

    output = nodes.new('ShaderNodeOutputMaterial')
    output.location = (200, 0)
    links.new(emission.outputs['Emission'], output.inputs['Surface'])

    return mat

def create_glass_material(name, color, roughness=0.1):
    """Create glass-like material"""
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()

    glass = nodes.new('ShaderNodeBsdfGlass')
    glass.inputs['Color'].default_value = color
    glass.inputs['Roughness'].default_value = roughness
    glass.inputs['IOR'].default_value = 1.5
    glass.location = (0, 0)

    output = nodes.new('ShaderNodeOutputMaterial')
    output.location = (200, 0)
    links.new(glass.outputs['BSDF'], output.inputs['Surface'])

    return mat

def clear_scene():
    """Clear all objects from scene"""
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete()

# ============================================================
# Animation 1: Laser Beam Loading
# A horizontal laser beam that scans across (for loading states)
# ============================================================

print("[VURMZ] Creating laser beam loading animation...")
clear_scene()
setup_camera_ortho(4)

# Create laser beam
bpy.ops.mesh.primitive_cylinder_add(radius=0.02, depth=0.3, location=(-2, 0, 0))
laser = bpy.context.active_object
laser.name = "Laser_Beam"
laser.rotation_euler = (0, math.radians(90), 0)

# Glowing teal laser
laser_mat = create_emission_material("Laser_Glow", VURMZ_TEAL, 20)
laser.data.materials.append(laser_mat)

# Laser trail (particle effect simulation with elongated mesh)
bpy.ops.mesh.primitive_plane_add(size=0.4, location=(-2, 0, 0))
trail = bpy.context.active_object
trail.name = "Laser_Trail"
trail.rotation_euler = (math.radians(90), 0, 0)

trail_mat = create_emission_material("Trail_Glow", (*VURMZ_TEAL[:3], 0.5), 5)
trail.data.materials.append(trail_mat)

# Animate laser scan
scene.frame_start = 1
scene.frame_end = 60  # 2 seconds

laser.location = (-2, 0, 0)
laser.keyframe_insert(data_path="location", frame=1)
trail.location = (-2, 0, 0)
trail.keyframe_insert(data_path="location", frame=1)

laser.location = (2, 0, 0)
laser.keyframe_insert(data_path="location", frame=60)
trail.location = (2, 0, 0)
trail.keyframe_insert(data_path="location", frame=60)

# Linear motion
if laser.animation_data:
    for fcurve in laser.animation_data.action.fcurves:
        for keyframe in fcurve.keyframe_points:
            keyframe.interpolation = 'LINEAR'

# Add point light for glow
bpy.ops.object.light_add(type='POINT', location=(-2, 0, 0))
glow_light = bpy.context.active_object
glow_light.data.energy = 100
glow_light.data.color = VURMZ_TEAL[:3]
glow_light.parent = laser

# Render
scene.render.resolution_x = 400
scene.render.resolution_y = 100
scene.render.image_settings.file_format = 'FFMPEG'
scene.render.ffmpeg.format = 'MPEG4'
scene.render.ffmpeg.codec = 'H264'
scene.render.filepath = os.path.join(video_dir, "laser-loading")
bpy.ops.render.render(animation=True)
print(f"[VURMZ] Exported: {scene.render.filepath}.mp4")

# ============================================================
# Animation 2: Glass Button Hover
# A subtle glass refraction/shimmer effect
# ============================================================

print("[VURMZ] Creating glass button hover animation...")
clear_scene()
setup_camera_ortho(3)

# Create rounded rectangle (button shape)
bpy.ops.mesh.primitive_cube_add(size=2, location=(0, 0, 0))
button = bpy.context.active_object
button.name = "Glass_Button"
button.scale = (1.5, 0.4, 0.1)
bpy.ops.object.transform_apply(scale=True)

# Add bevel for rounded corners
bevel_mod = button.modifiers.new(name="Bevel", type='BEVEL')
bevel_mod.width = 0.15
bevel_mod.segments = 8

# Glass material
glass_mat = create_glass_material("Button_Glass", (0.95, 0.97, 0.97, 0.3), 0.05)
button.data.materials.append(glass_mat)

# Shimmer light that moves across
bpy.ops.object.light_add(type='SPOT', location=(-3, -2, 1))
shimmer = bpy.context.active_object
shimmer.name = "Shimmer_Light"
shimmer.data.energy = 200
shimmer.data.color = (1, 1, 1)
shimmer.data.spot_size = math.radians(30)
shimmer.data.spot_blend = 0.8

# Animate shimmer across button
scene.frame_start = 1
scene.frame_end = 45

shimmer.location = (-3, -2, 1)
shimmer.keyframe_insert(data_path="location", frame=1)

shimmer.location = (3, -2, 1)
shimmer.keyframe_insert(data_path="location", frame=45)

# Render
scene.render.resolution_x = 300
scene.render.resolution_y = 80
scene.render.filepath = os.path.join(video_dir, "glass-shimmer")
bpy.ops.render.render(animation=True)
print(f"[VURMZ] Exported: {scene.render.filepath}.mp4")

# ============================================================
# Animation 3: Water Droplet Splash
# For page transitions - a droplet hits surface and ripples
# ============================================================

print("[VURMZ] Creating water droplet splash animation...")
clear_scene()
setup_camera_ortho(2)

# Create droplet
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.1, location=(0, 0, 1))
droplet = bpy.context.active_object
droplet.name = "Water_Droplet"

water_mat = create_glass_material("Water", (*VURMZ_SKY[:3], 0.8), 0.02)
droplet.data.materials.append(water_mat)

# Create ripple rings (will animate scale)
ripples = []
for i in range(3):
    bpy.ops.mesh.primitive_torus_add(
        major_radius=0.05,
        minor_radius=0.01,
        location=(0, 0, 0)
    )
    ring = bpy.context.active_object
    ring.name = f"Ripple_{i}"
    ring.data.materials.append(water_mat)
    ripples.append(ring)

# Animate
scene.frame_start = 1
scene.frame_end = 60

# Droplet falls
droplet.location = (0, 0, 1)
droplet.scale = (1, 1, 1.2)
droplet.keyframe_insert(data_path="location", frame=1)
droplet.keyframe_insert(data_path="scale", frame=1)

droplet.location = (0, 0, 0.1)
droplet.scale = (1.5, 1.5, 0.5)
droplet.keyframe_insert(data_path="location", frame=15)
droplet.keyframe_insert(data_path="scale", frame=15)

droplet.scale = (0, 0, 0)
droplet.keyframe_insert(data_path="scale", frame=20)

# Ripples expand
for i, ring in enumerate(ripples):
    start_frame = 15 + (i * 8)

    ring.scale = (0, 0, 1)
    ring.keyframe_insert(data_path="scale", frame=start_frame)

    ring.scale = (3 + i, 3 + i, 1)
    ring.keyframe_insert(data_path="scale", frame=start_frame + 30)

    # Fade out by scaling Z to 0
    ring.scale = (4 + i, 4 + i, 0)
    ring.keyframe_insert(data_path="scale", frame=start_frame + 40)

# Render
scene.render.resolution_x = 200
scene.render.resolution_y = 200
scene.render.filepath = os.path.join(video_dir, "water-splash")
bpy.ops.render.render(animation=True)
print(f"[VURMZ] Exported: {scene.render.filepath}.mp4")

# ============================================================
# Animation 4: Floating Particles
# Ambient particles floating up slowly (for background ambiance)
# ============================================================

print("[VURMZ] Creating floating particles animation...")
clear_scene()
setup_camera_ortho(5)

# Create multiple small particles
particles = []
random.seed(42)  # Reproducible randomness

particle_mat = create_emission_material("Particle_Glow", VURMZ_TEAL, 3)

for i in range(20):
    x = random.uniform(-2, 2)
    z = random.uniform(-2, 2)
    size = random.uniform(0.02, 0.06)

    bpy.ops.mesh.primitive_uv_sphere_add(radius=size, location=(x, 0, z))
    particle = bpy.context.active_object
    particle.name = f"Particle_{i}"
    particle.data.materials.append(particle_mat)
    particles.append((particle, x, z, random.uniform(0.5, 1.5)))

# Animate particles floating up
scene.frame_start = 1
scene.frame_end = 120  # 4 second loop

for particle, x, start_z, speed in particles:
    # Start position
    particle.location = (x, 0, start_z)
    particle.keyframe_insert(data_path="location", frame=1)

    # End position (floated up and wrapped)
    end_z = start_z + (3 * speed)
    particle.location = (x + random.uniform(-0.3, 0.3), 0, end_z)
    particle.keyframe_insert(data_path="location", frame=120)

    # Subtle scale breathing
    particle.scale = (1, 1, 1)
    particle.keyframe_insert(data_path="scale", frame=1)

    particle.scale = (1.3, 1.3, 1.3)
    particle.keyframe_insert(data_path="scale", frame=60)

    particle.scale = (1, 1, 1)
    particle.keyframe_insert(data_path="scale", frame=120)

# Render
scene.render.resolution_x = 400
scene.render.resolution_y = 400
scene.render.filepath = os.path.join(video_dir, "floating-particles")
bpy.ops.render.render(animation=True)
print(f"[VURMZ] Exported: {scene.render.filepath}.mp4")

# ============================================================
# Animation 5: Engraving Reveal
# A laser "engraves" text being revealed
# ============================================================

print("[VURMZ] Creating engraving reveal animation...")
clear_scene()
setup_camera_ortho(3)

# Create text object
bpy.ops.object.text_add(location=(0, 0, 0))
text_obj = bpy.context.active_object
text_obj.data.body = "VURMZ"
text_obj.data.size = 0.5
text_obj.data.extrude = 0.02
text_obj.rotation_euler = (math.radians(90), 0, 0)

# Center text
text_obj.data.align_x = 'CENTER'
text_obj.location = (0, 0, 0)

# Metal material
metal_mat = bpy.data.materials.new(name="Engraved_Metal")
metal_mat.use_nodes = True
nodes = metal_mat.node_tree.nodes
links = metal_mat.node_tree.links
nodes.clear()

bsdf = nodes.new('ShaderNodeBsdfPrincipled')
bsdf.inputs['Base Color'].default_value = VURMZ_DARK
bsdf.inputs['Metallic'].default_value = 0.95
bsdf.inputs['Roughness'].default_value = 0.1
bsdf.location = (0, 0)

output = nodes.new('ShaderNodeOutputMaterial')
output.location = (200, 0)
links.new(bsdf.outputs['BSDF'], output.inputs['Surface'])

text_obj.data.materials.append(metal_mat)

# Reveal mask (plane that slides away)
bpy.ops.mesh.primitive_plane_add(size=4, location=(0, -0.05, 0))
mask = bpy.context.active_object
mask.name = "Reveal_Mask"
mask.rotation_euler = (math.radians(90), 0, 0)

mask_mat = bpy.data.materials.new(name="Mask_Material")
mask_mat.use_nodes = True
mask_nodes = mask_mat.node_tree.nodes
mask_links = mask_mat.node_tree.links
mask_nodes.clear()

bg = mask_nodes.new('ShaderNodeBackground')
bg.inputs['Color'].default_value = (0.95, 0.96, 0.96, 1.0)
bg.location = (0, 0)

mask_output = mask_nodes.new('ShaderNodeOutputMaterial')
mask_output.location = (200, 0)
mask_links.new(bg.outputs['Background'], mask_output.inputs['Surface'])

mask.data.materials.append(mask_mat)

# Laser point
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.03, location=(-1.5, -0.03, 0))
laser_point = bpy.context.active_object
laser_point.name = "Laser_Point"
laser_glow = create_emission_material("Laser_Point_Glow", (1, 0.3, 0.1, 1), 30)
laser_point.data.materials.append(laser_glow)

# Animate reveal
scene.frame_start = 1
scene.frame_end = 90

# Mask slides right to reveal text
mask.location = (0, -0.05, 0)
mask.keyframe_insert(data_path="location", frame=1)

mask.location = (4, -0.05, 0)
mask.keyframe_insert(data_path="location", frame=90)

# Laser follows mask edge
laser_point.location = (-1.5, -0.03, 0)
laser_point.keyframe_insert(data_path="location", frame=1)

laser_point.location = (2.5, -0.03, 0)
laser_point.keyframe_insert(data_path="location", frame=90)

# Linear motion
if mask.animation_data:
    for fcurve in mask.animation_data.action.fcurves:
        for keyframe in fcurve.keyframe_points:
            keyframe.interpolation = 'LINEAR'

# Render
scene.render.resolution_x = 600
scene.render.resolution_y = 150
scene.render.filepath = os.path.join(video_dir, "engraving-reveal")
bpy.ops.render.render(animation=True)
print(f"[VURMZ] Exported: {scene.render.filepath}.mp4")

print("\n[VURMZ] Site animation generation complete!")
print(f"  - Laser loading: {os.path.join(video_dir, 'laser-loading.mp4')}")
print(f"  - Glass shimmer: {os.path.join(video_dir, 'glass-shimmer.mp4')}")
print(f"  - Water splash: {os.path.join(video_dir, 'water-splash.mp4')}")
print(f"  - Floating particles: {os.path.join(video_dir, 'floating-particles.mp4')}")
print(f"  - Engraving reveal: {os.path.join(video_dir, 'engraving-reveal.mp4')}")
