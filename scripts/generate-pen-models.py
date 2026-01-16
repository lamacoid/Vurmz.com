"""
Blender Python Script: Generate Realistic Pen 3D Models
========================================================
This script generates stylus and fountain pen 3D models for use in Three.js.

Run with: blender --background --python generate-pen-models.py

Output:
- /Users/zacharydemillo/Desktop/WEBSITE PROJECT/public/models/pen-stylus.glb
- /Users/zacharydemillo/Desktop/WEBSITE PROJECT/public/models/pen-fountain.glb
"""

import bpy
import bmesh
import math
import os

# Output directory
OUTPUT_DIR = "/Users/zacharydemillo/Desktop/WEBSITE PROJECT/public/models"


def clear_scene():
    """Remove all objects from the scene."""
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)

    # Clear all materials
    for material in bpy.data.materials:
        bpy.data.materials.remove(material)

    # Clear all meshes
    for mesh in bpy.data.meshes:
        bpy.data.meshes.remove(mesh)


def create_chrome_material(name="Chrome"):
    """Create a metallic chrome material."""
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links

    # Clear default nodes
    nodes.clear()

    # Create Principled BSDF
    bsdf = nodes.new('ShaderNodeBsdfPrincipled')
    bsdf.location = (0, 0)
    bsdf.inputs['Base Color'].default_value = (0.8, 0.8, 0.85, 1.0)
    bsdf.inputs['Metallic'].default_value = 1.0
    bsdf.inputs['Roughness'].default_value = 0.15
    bsdf.inputs['IOR'].default_value = 2.5

    # Output node
    output = nodes.new('ShaderNodeOutputMaterial')
    output.location = (300, 0)

    links.new(bsdf.outputs['BSDF'], output.inputs['Surface'])

    return mat


def create_barrel_material(name="Barrel", color=(0.1, 0.1, 0.12, 1.0)):
    """Create a matte soft-touch barrel material."""
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links

    # Clear default nodes
    nodes.clear()

    # Create Principled BSDF
    bsdf = nodes.new('ShaderNodeBsdfPrincipled')
    bsdf.location = (0, 0)
    bsdf.inputs['Base Color'].default_value = color
    bsdf.inputs['Metallic'].default_value = 0.0
    bsdf.inputs['Roughness'].default_value = 0.7
    bsdf.inputs['Specular IOR Level'].default_value = 0.3

    # Output node
    output = nodes.new('ShaderNodeOutputMaterial')
    output.location = (300, 0)

    links.new(bsdf.outputs['BSDF'], output.inputs['Surface'])

    return mat


def create_rubber_material(name="Rubber"):
    """Create a rubber material for stylus tip."""
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links

    # Clear default nodes
    nodes.clear()

    # Create Principled BSDF
    bsdf = nodes.new('ShaderNodeBsdfPrincipled')
    bsdf.location = (0, 0)
    bsdf.inputs['Base Color'].default_value = (0.05, 0.05, 0.05, 1.0)
    bsdf.inputs['Metallic'].default_value = 0.0
    bsdf.inputs['Roughness'].default_value = 0.9
    bsdf.inputs['Specular IOR Level'].default_value = 0.1

    # Output node
    output = nodes.new('ShaderNodeOutputMaterial')
    output.location = (300, 0)

    links.new(bsdf.outputs['BSDF'], output.inputs['Surface'])

    return mat


def create_gold_material(name="Gold"):
    """Create a gold material for fountain pen accents."""
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links

    # Clear default nodes
    nodes.clear()

    # Create Principled BSDF
    bsdf = nodes.new('ShaderNodeBsdfPrincipled')
    bsdf.location = (0, 0)
    bsdf.inputs['Base Color'].default_value = (0.83, 0.69, 0.22, 1.0)
    bsdf.inputs['Metallic'].default_value = 1.0
    bsdf.inputs['Roughness'].default_value = 0.25
    bsdf.inputs['IOR'].default_value = 2.5

    # Output node
    output = nodes.new('ShaderNodeOutputMaterial')
    output.location = (300, 0)

    links.new(bsdf.outputs['BSDF'], output.inputs['Surface'])

    return mat


def create_nib_material(name="Nib"):
    """Create a polished gold material for fountain pen nib."""
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links

    # Clear default nodes
    nodes.clear()

    # Create Principled BSDF
    bsdf = nodes.new('ShaderNodeBsdfPrincipled')
    bsdf.location = (0, 0)
    bsdf.inputs['Base Color'].default_value = (0.9, 0.75, 0.25, 1.0)
    bsdf.inputs['Metallic'].default_value = 1.0
    bsdf.inputs['Roughness'].default_value = 0.1
    bsdf.inputs['IOR'].default_value = 2.5

    # Output node
    output = nodes.new('ShaderNodeOutputMaterial')
    output.location = (300, 0)

    links.new(bsdf.outputs['BSDF'], output.inputs['Surface'])

    return mat


def create_cylinder_mesh(name, radius, depth, location, segments=32):
    """Create a cylinder mesh at the specified location."""
    bpy.ops.mesh.primitive_cylinder_add(
        vertices=segments,
        radius=radius,
        depth=depth,
        location=location
    )
    obj = bpy.context.active_object
    obj.name = name
    return obj


def create_cone_mesh(name, radius1, radius2, depth, location, segments=32):
    """Create a cone/truncated cone mesh at the specified location."""
    bpy.ops.mesh.primitive_cone_add(
        vertices=segments,
        radius1=radius1,
        radius2=radius2,
        depth=depth,
        location=location
    )
    obj = bpy.context.active_object
    obj.name = name
    return obj


def create_sphere_mesh(name, radius, location, segments=32):
    """Create a UV sphere mesh at the specified location."""
    bpy.ops.mesh.primitive_uv_sphere_add(
        segments=segments,
        ring_count=segments // 2,
        radius=radius,
        location=location
    )
    obj = bpy.context.active_object
    obj.name = name
    return obj


def create_torus_mesh(name, major_radius, minor_radius, location, major_segments=48, minor_segments=16):
    """Create a torus mesh at the specified location."""
    bpy.ops.mesh.primitive_torus_add(
        major_radius=major_radius,
        minor_radius=minor_radius,
        major_segments=major_segments,
        minor_segments=minor_segments,
        location=location
    )
    obj = bpy.context.active_object
    obj.name = name
    return obj


def smooth_object(obj):
    """Apply smooth shading to an object."""
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    bpy.ops.object.shade_smooth()
    obj.select_set(False)


def apply_material(obj, material):
    """Apply a material to an object."""
    if obj.data.materials:
        obj.data.materials[0] = material
    else:
        obj.data.materials.append(material)


def create_pocket_clip(chrome_mat, start_z, clip_length=0.08, barrel_radius=0.008):
    """Create a pocket clip for the pen."""
    clip_parts = []

    # Main clip body - curved piece
    clip_width = 0.003
    clip_thickness = 0.001

    # Create clip using a bezier curve extruded
    bpy.ops.curve.primitive_bezier_curve_add(location=(0, 0, 0))
    curve = bpy.context.active_object
    curve.name = "ClipCurve"

    # Modify bezier points to create clip shape
    spline = curve.data.splines[0]

    # Start point - attached to pen
    spline.bezier_points[0].co = (barrel_radius + 0.001, 0, start_z)
    spline.bezier_points[0].handle_left = (barrel_radius + 0.001, 0, start_z + 0.01)
    spline.bezier_points[0].handle_right = (barrel_radius + 0.001, 0, start_z - 0.01)

    # End point - curves back toward pen
    spline.bezier_points[1].co = (barrel_radius + 0.004, 0, start_z - clip_length)
    spline.bezier_points[1].handle_left = (barrel_radius + 0.006, 0, start_z - clip_length + 0.015)
    spline.bezier_points[1].handle_right = (barrel_radius + 0.002, 0, start_z - clip_length - 0.005)

    # Set curve properties
    curve.data.bevel_depth = clip_thickness
    curve.data.bevel_resolution = 4
    curve.data.use_fill_caps = True

    # Create profile for clip (rectangle)
    bpy.ops.curve.primitive_bezier_circle_add(radius=clip_width, location=(0, 0, 0))
    profile = bpy.context.active_object
    profile.name = "ClipProfile"

    # Scale to make rectangular
    profile.scale = (1.0, 0.3, 1.0)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)

    curve.data.bevel_mode = 'OBJECT'
    curve.data.bevel_object = profile

    # Convert to mesh
    bpy.context.view_layer.objects.active = curve
    curve.select_set(True)
    bpy.ops.object.convert(target='MESH')
    clip_mesh = bpy.context.active_object
    clip_mesh.name = "PocketClip"

    # Apply material
    apply_material(clip_mesh, chrome_mat)
    smooth_object(clip_mesh)

    # Delete profile curve
    bpy.data.objects.remove(profile, do_unlink=True)

    # Create clip attachment ring
    ring = create_torus_mesh(
        "ClipRing",
        major_radius=barrel_radius + 0.0015,
        minor_radius=0.0012,
        location=(0, 0, start_z + 0.002)
    )
    apply_material(ring, chrome_mat)
    smooth_object(ring)

    # Create clip tip ball
    tip_ball = create_sphere_mesh(
        "ClipTipBall",
        radius=0.0015,
        location=(barrel_radius + 0.003, 0, start_z - clip_length + 0.002)
    )
    apply_material(tip_ball, chrome_mat)
    smooth_object(tip_ball)

    return [clip_mesh, ring, tip_ball]


def create_stylus_pen():
    """Create a complete stylus pen model."""
    clear_scene()

    # Create materials
    chrome_mat = create_chrome_material("Chrome")
    barrel_mat = create_barrel_material("Barrel", (0.15, 0.15, 0.18, 1.0))
    rubber_mat = create_rubber_material("Rubber")

    pen_parts = []

    # Pen dimensions (in meters, scaled for reasonable Three.js size)
    total_length = 0.14  # 14cm total length
    barrel_radius = 0.0055  # 5.5mm radius

    # === WRITING TIP (Chrome cone) ===
    tip_length = 0.015
    tip = create_cone_mesh(
        "WritingTip",
        radius1=0.0008,  # Point
        radius2=barrel_radius * 0.7,
        depth=tip_length,
        location=(0, 0, -total_length/2 + tip_length/2)
    )
    apply_material(tip, chrome_mat)
    smooth_object(tip)
    pen_parts.append(tip)

    # === TIP TRANSITION RING ===
    tip_ring = create_torus_mesh(
        "TipRing",
        major_radius=barrel_radius * 0.75,
        minor_radius=0.001,
        location=(0, 0, -total_length/2 + tip_length)
    )
    apply_material(tip_ring, chrome_mat)
    smooth_object(tip_ring)
    pen_parts.append(tip_ring)

    # === LOWER CHROME SECTION ===
    lower_chrome_length = 0.012
    lower_chrome = create_cylinder_mesh(
        "LowerChrome",
        radius=barrel_radius * 0.8,
        depth=lower_chrome_length,
        location=(0, 0, -total_length/2 + tip_length + lower_chrome_length/2)
    )
    apply_material(lower_chrome, chrome_mat)
    smooth_object(lower_chrome)
    pen_parts.append(lower_chrome)

    # === GRIP SECTION (Barrel material with texture) ===
    grip_length = 0.035
    grip_start = -total_length/2 + tip_length + lower_chrome_length
    grip = create_cylinder_mesh(
        "GripSection",
        radius=barrel_radius * 0.9,
        depth=grip_length,
        location=(0, 0, grip_start + grip_length/2)
    )
    apply_material(grip, barrel_mat)
    smooth_object(grip)
    pen_parts.append(grip)

    # === CENTER ACCENT RING ===
    center_ring_z = grip_start + grip_length
    center_ring = create_torus_mesh(
        "CenterRing",
        major_radius=barrel_radius,
        minor_radius=0.0015,
        location=(0, 0, center_ring_z)
    )
    apply_material(center_ring, chrome_mat)
    smooth_object(center_ring)
    pen_parts.append(center_ring)

    # === MAIN BARREL ===
    barrel_length = 0.055
    barrel_start = center_ring_z
    barrel = create_cylinder_mesh(
        "MainBarrel",
        radius=barrel_radius,
        depth=barrel_length,
        location=(0, 0, barrel_start + barrel_length/2)
    )
    apply_material(barrel, barrel_mat)
    smooth_object(barrel)
    pen_parts.append(barrel)

    # === UPPER ACCENT RING ===
    upper_ring_z = barrel_start + barrel_length
    upper_ring = create_torus_mesh(
        "UpperRing",
        major_radius=barrel_radius,
        minor_radius=0.0012,
        location=(0, 0, upper_ring_z)
    )
    apply_material(upper_ring, chrome_mat)
    smooth_object(upper_ring)
    pen_parts.append(upper_ring)

    # === CAP/END SECTION ===
    cap_length = 0.018
    cap_start = upper_ring_z
    cap = create_cylinder_mesh(
        "CapSection",
        radius=barrel_radius * 1.05,
        depth=cap_length,
        location=(0, 0, cap_start + cap_length/2)
    )
    apply_material(cap, barrel_mat)
    smooth_object(cap)
    pen_parts.append(cap)

    # === POCKET CLIP ===
    clip_parts = create_pocket_clip(chrome_mat, cap_start + cap_length - 0.003, clip_length=0.06, barrel_radius=barrel_radius * 1.05)
    pen_parts.extend(clip_parts)

    # === END CAP RING ===
    end_ring_z = cap_start + cap_length
    end_ring = create_torus_mesh(
        "EndRing",
        major_radius=barrel_radius * 1.05,
        minor_radius=0.001,
        location=(0, 0, end_ring_z)
    )
    apply_material(end_ring, chrome_mat)
    smooth_object(end_ring)
    pen_parts.append(end_ring)

    # === STYLUS TIP (Rubber) ===
    stylus_tip_length = 0.008
    stylus_tip_start = end_ring_z

    # Stylus tip cone
    stylus_cone = create_cone_mesh(
        "StylusCone",
        radius1=barrel_radius * 0.95,
        radius2=barrel_radius * 0.5,
        depth=stylus_tip_length * 0.6,
        location=(0, 0, stylus_tip_start + stylus_tip_length * 0.3)
    )
    apply_material(stylus_cone, rubber_mat)
    smooth_object(stylus_cone)
    pen_parts.append(stylus_cone)

    # Stylus rubber tip (dome)
    stylus_dome = create_sphere_mesh(
        "StylusDome",
        radius=barrel_radius * 0.5,
        location=(0, 0, stylus_tip_start + stylus_tip_length * 0.6)
    )
    apply_material(stylus_dome, rubber_mat)
    smooth_object(stylus_dome)
    pen_parts.append(stylus_dome)

    # Select all pen parts and join them
    bpy.ops.object.select_all(action='DESELECT')
    for part in pen_parts:
        part.select_set(True)
    bpy.context.view_layer.objects.active = pen_parts[0]
    bpy.ops.object.join()

    # Rename the joined object
    pen = bpy.context.active_object
    pen.name = "StylusPen"

    # Center the pen
    bpy.ops.object.origin_set(type='ORIGIN_CENTER_OF_VOLUME', center='MEDIAN')
    pen.location = (0, 0, 0)

    # Rotate so pen is horizontal (for better viewing in Three.js)
    pen.rotation_euler = (math.pi / 2, 0, 0)
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=False)

    return pen


def create_fountain_pen():
    """Create a complete fountain pen model."""
    clear_scene()

    # Create materials
    gold_mat = create_gold_material("Gold")
    nib_mat = create_nib_material("Nib")
    barrel_mat = create_barrel_material("Barrel", (0.02, 0.02, 0.05, 1.0))  # Deep navy

    pen_parts = []

    # Pen dimensions
    total_length = 0.145  # 14.5cm total length
    barrel_radius = 0.006  # 6mm radius

    # === NIB (Gold, flat pointed shape) ===
    # Create nib using a custom mesh
    bpy.ops.mesh.primitive_cone_add(
        vertices=4,
        radius1=0.0003,
        radius2=0.004,
        depth=0.018,
        location=(0, 0, -total_length/2 + 0.009)
    )
    nib = bpy.context.active_object
    nib.name = "Nib"

    # Flatten the nib
    nib.scale = (0.3, 1.0, 1.0)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)

    apply_material(nib, nib_mat)
    smooth_object(nib)
    pen_parts.append(nib)

    # === NIB COLLAR (Feed section) ===
    collar_length = 0.008
    collar_start = -total_length/2 + 0.018
    collar = create_cylinder_mesh(
        "NibCollar",
        radius=barrel_radius * 0.6,
        depth=collar_length,
        location=(0, 0, collar_start + collar_length/2)
    )
    apply_material(collar, barrel_mat)
    smooth_object(collar)
    pen_parts.append(collar)

    # === SECTION (Grip area) ===
    section_length = 0.025
    section_start = collar_start + collar_length

    # Section with slight taper
    section = create_cone_mesh(
        "Section",
        radius1=barrel_radius * 0.7,
        radius2=barrel_radius * 0.85,
        depth=section_length,
        location=(0, 0, section_start + section_length/2)
    )
    apply_material(section, barrel_mat)
    smooth_object(section)
    pen_parts.append(section)

    # === GOLD SECTION RING ===
    section_ring = create_torus_mesh(
        "SectionRing",
        major_radius=barrel_radius * 0.85,
        minor_radius=0.0012,
        location=(0, 0, section_start + section_length)
    )
    apply_material(section_ring, gold_mat)
    smooth_object(section_ring)
    pen_parts.append(section_ring)

    # === BARREL THREADS (decorative) ===
    threads_length = 0.006
    threads_start = section_start + section_length
    threads = create_cylinder_mesh(
        "Threads",
        radius=barrel_radius * 0.9,
        depth=threads_length,
        location=(0, 0, threads_start + threads_length/2)
    )
    apply_material(threads, gold_mat)
    smooth_object(threads)
    pen_parts.append(threads)

    # === MAIN BARREL ===
    barrel_length = 0.06
    barrel_start = threads_start + threads_length
    barrel = create_cylinder_mesh(
        "MainBarrel",
        radius=barrel_radius,
        depth=barrel_length,
        location=(0, 0, barrel_start + barrel_length/2)
    )
    apply_material(barrel, barrel_mat)
    smooth_object(barrel)
    pen_parts.append(barrel)

    # === CENTER BAND (Gold) ===
    center_band_z = barrel_start + barrel_length
    center_band = create_cylinder_mesh(
        "CenterBand",
        radius=barrel_radius * 1.08,
        depth=0.004,
        location=(0, 0, center_band_z + 0.002)
    )
    apply_material(center_band, gold_mat)
    smooth_object(center_band)
    pen_parts.append(center_band)

    # Add decorative rings on band
    for offset in [-0.001, 0.001]:
        ring = create_torus_mesh(
            f"BandRing_{offset}",
            major_radius=barrel_radius * 1.08,
            minor_radius=0.0003,
            location=(0, 0, center_band_z + 0.002 + offset)
        )
        apply_material(ring, gold_mat)
        smooth_object(ring)
        pen_parts.append(ring)

    # === CAP BARREL ===
    cap_barrel_length = 0.035
    cap_barrel_start = center_band_z + 0.004
    cap_barrel = create_cylinder_mesh(
        "CapBarrel",
        radius=barrel_radius * 1.05,
        depth=cap_barrel_length,
        location=(0, 0, cap_barrel_start + cap_barrel_length/2)
    )
    apply_material(cap_barrel, barrel_mat)
    smooth_object(cap_barrel)
    pen_parts.append(cap_barrel)

    # === POCKET CLIP (Gold) ===
    clip_parts = create_pocket_clip(gold_mat, cap_barrel_start + cap_barrel_length - 0.005, clip_length=0.055, barrel_radius=barrel_radius * 1.05)
    pen_parts.extend(clip_parts)

    # === CAP TOP RING ===
    cap_top_z = cap_barrel_start + cap_barrel_length
    cap_top_ring = create_torus_mesh(
        "CapTopRing",
        major_radius=barrel_radius * 1.05,
        minor_radius=0.001,
        location=(0, 0, cap_top_z)
    )
    apply_material(cap_top_ring, gold_mat)
    smooth_object(cap_top_ring)
    pen_parts.append(cap_top_ring)

    # === FINIAL (Cap top decoration) ===
    finial_length = 0.008
    finial = create_cone_mesh(
        "Finial",
        radius1=barrel_radius * 1.0,
        radius2=barrel_radius * 0.4,
        depth=finial_length,
        location=(0, 0, cap_top_z + finial_length/2)
    )
    apply_material(finial, barrel_mat)
    smooth_object(finial)
    pen_parts.append(finial)

    # === FINIAL TOP (Gold ball) ===
    finial_ball = create_sphere_mesh(
        "FinialBall",
        radius=barrel_radius * 0.45,
        location=(0, 0, cap_top_z + finial_length)
    )
    apply_material(finial_ball, gold_mat)
    smooth_object(finial_ball)
    pen_parts.append(finial_ball)

    # Select all pen parts and join them
    bpy.ops.object.select_all(action='DESELECT')
    for part in pen_parts:
        part.select_set(True)
    bpy.context.view_layer.objects.active = pen_parts[0]
    bpy.ops.object.join()

    # Rename the joined object
    pen = bpy.context.active_object
    pen.name = "FountainPen"

    # Center the pen
    bpy.ops.object.origin_set(type='ORIGIN_CENTER_OF_VOLUME', center='MEDIAN')
    pen.location = (0, 0, 0)

    # Rotate so pen is horizontal
    pen.rotation_euler = (math.pi / 2, 0, 0)
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=False)

    return pen


def export_to_glb(filepath):
    """Export the current scene to GLB format."""
    # Ensure the directory exists
    os.makedirs(os.path.dirname(filepath), exist_ok=True)

    # Export settings for Three.js compatibility (Blender 4.3+)
    bpy.ops.export_scene.gltf(
        filepath=filepath,
        export_format='GLB',
        use_selection=True,
        export_apply=True,
        export_materials='EXPORT',
        export_cameras=False,
        export_lights=False
    )
    print(f"Exported: {filepath}")


def main():
    """Main function to generate all pen models."""
    print("=" * 50)
    print("Generating Pen 3D Models for Three.js")
    print("=" * 50)

    # Generate and export stylus pen
    print("\n[1/2] Creating Stylus Pen...")
    create_stylus_pen()
    stylus_path = os.path.join(OUTPUT_DIR, "pen-stylus.glb")

    # Select the pen for export
    bpy.ops.object.select_all(action='SELECT')
    export_to_glb(stylus_path)
    print(f"Stylus pen exported to: {stylus_path}")

    # Generate and export fountain pen
    print("\n[2/2] Creating Fountain Pen...")
    create_fountain_pen()
    fountain_path = os.path.join(OUTPUT_DIR, "pen-fountain.glb")

    # Select the pen for export
    bpy.ops.object.select_all(action='SELECT')
    export_to_glb(fountain_path)
    print(f"Fountain pen exported to: {fountain_path}")

    print("\n" + "=" * 50)
    print("All pen models generated successfully!")
    print("=" * 50)
    print(f"\nOutput files:")
    print(f"  - {stylus_path}")
    print(f"  - {fountain_path}")
    print("\nMaterial names for Three.js color swapping:")
    print("  - 'Barrel' - Main body color (matte soft-touch)")
    print("  - 'Chrome' / 'Gold' - Metallic accents")
    print("  - 'Rubber' - Stylus tip (stylus pen only)")
    print("  - 'Nib' - Fountain pen nib")


if __name__ == "__main__":
    main()
