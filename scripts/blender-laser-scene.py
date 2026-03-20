import bpy
import math
import os

# ─── Clean scene ────────────────────────────────────────────
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete()

# Remove default collections data
for col in bpy.data.collections:
    bpy.data.collections.remove(col)
for mesh in bpy.data.meshes:
    bpy.data.meshes.remove(mesh)
for mat in bpy.data.materials:
    bpy.data.materials.remove(mat)

# ─── Materials ──────────────────────────────────────────────

def make_material(name, base_color, metallic=0.0, roughness=0.5, emission=None, emission_strength=0.0):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()

    output = nodes.new('ShaderNodeOutputMaterial')
    bsdf = nodes.new('ShaderNodeBsdfPrincipled')
    bsdf.inputs['Base Color'].default_value = base_color
    bsdf.inputs['Metallic'].default_value = metallic
    bsdf.inputs['Roughness'].default_value = roughness

    if emission:
        bsdf.inputs['Emission Color'].default_value = emission
        bsdf.inputs['Emission Strength'].default_value = emission_strength

    links.new(bsdf.outputs['BSDF'], output.inputs['Surface'])
    return mat

# Machine bed — dark industrial steel
bed_mat = make_material('MachineBed', (0.02, 0.025, 0.025, 1), metallic=0.9, roughness=0.6)

# Workpiece — anodized aluminum (dark blue-black)
workpiece_mat = make_material('Workpiece', (0.015, 0.02, 0.03, 1), metallic=0.85, roughness=0.3)

# Laser head housing — brushed aluminum
head_mat = make_material('LaserHead', (0.15, 0.15, 0.16, 1), metallic=0.95, roughness=0.35)

# Laser nozzle — dark steel
nozzle_mat = make_material('Nozzle', (0.03, 0.03, 0.035, 1), metallic=0.9, roughness=0.4)

# Rails — chrome
rail_mat = make_material('Rails', (0.4, 0.4, 0.42, 1), metallic=1.0, roughness=0.15)

# Rubber feet/pads
rubber_mat = make_material('Rubber', (0.01, 0.01, 0.01, 1), metallic=0.0, roughness=0.9)

# LED indicator (teal glow)
led_mat = make_material('LED', (0.0, 0.3, 0.28, 1), metallic=0.0, roughness=0.3,
                         emission=(0.0, 0.8, 0.7, 1), emission_strength=5.0)

# T-slot pattern material (darker grooves)
tslot_mat = make_material('TSlot', (0.01, 0.015, 0.015, 1), metallic=0.8, roughness=0.7)

# ─── Machine Bed (T-slot table) ─────────────────────────────
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, -0.15))
bed = bpy.context.active_object
bed.name = 'MachineBed'
bed.scale = (3.0, 2.0, 0.12)
bed.data.materials.append(bed_mat)

# T-slot grooves on the bed
for i in range(-4, 5):
    bpy.ops.mesh.primitive_cube_add(size=1, location=(i * 0.6, 0, -0.08))
    groove = bpy.context.active_object
    groove.name = f'TSlot_{i}'
    groove.scale = (0.03, 2.0, 0.02)
    groove.data.materials.append(tslot_mat)

# ─── Workpiece (anodized aluminum plate) ─────────────────────
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 0.02))
workpiece = bpy.context.active_object
workpiece.name = 'Workpiece'
workpiece.scale = (1.8, 1.0, 0.04)
workpiece.data.materials.append(workpiece_mat)

# Slight bevel on the workpiece edges
bpy.ops.object.modifier_add(type='BEVEL')
workpiece.modifiers['Bevel'].width = 0.008
workpiece.modifiers['Bevel'].segments = 3

# ─── Gantry system ──────────────────────────────────────────

# Y-axis rails (side rails running front-to-back)
for x_pos in [-1.4, 1.4]:
    bpy.ops.mesh.primitive_cylinder_add(radius=0.04, depth=2.4, location=(x_pos, 0, 0.25))
    rail = bpy.context.active_object
    rail.name = f'YRail_{x_pos}'
    rail.rotation_euler = (math.pi/2, 0, 0)
    rail.data.materials.append(rail_mat)

    # Rail support brackets
    for y_pos in [-0.9, 0, 0.9]:
        bpy.ops.mesh.primitive_cube_add(size=1, location=(x_pos, y_pos, 0.15))
        bracket = bpy.context.active_object
        bracket.name = f'Bracket_{x_pos}_{y_pos}'
        bracket.scale = (0.08, 0.06, 0.1)
        bracket.data.materials.append(bed_mat)

# X-axis rail (cross rail — the gantry beam)
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0.2, 0.35))
xrail = bpy.context.active_object
xrail.name = 'XRail'
xrail.scale = (2.9, 0.06, 0.08)
xrail.data.materials.append(rail_mat)

# Gantry beam stiffener
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0.2, 0.42))
stiffener = bpy.context.active_object
stiffener.name = 'GantryStiffener'
stiffener.scale = (2.85, 0.04, 0.03)
stiffener.data.materials.append(bed_mat)

# ─── Laser Head Assembly ────────────────────────────────────

# Main housing
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0.2, 0.55))
head = bpy.context.active_object
head.name = 'LaserHeadHousing'
head.scale = (0.12, 0.12, 0.14)
head.data.materials.append(head_mat)

# Bevel the housing
bpy.ops.object.modifier_add(type='BEVEL')
head.modifiers['Bevel'].width = 0.01
head.modifiers['Bevel'].segments = 2

# Nozzle cone
bpy.ops.mesh.primitive_cone_add(radius1=0.04, radius2=0.015, depth=0.12, location=(0, 0.2, 0.42))
nozzle = bpy.context.active_object
nozzle.name = 'Nozzle'
nozzle.rotation_euler = (math.pi, 0, 0)
nozzle.data.materials.append(nozzle_mat)

# LED indicator on the head
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.008, location=(0.06, 0.13, 0.58))
led = bpy.context.active_object
led.name = 'LED'
led.data.materials.append(led_mat)

# Air assist tube
bpy.ops.mesh.primitive_cylinder_add(radius=0.012, depth=0.15, location=(-0.07, 0.2, 0.5))
tube = bpy.context.active_object
tube.name = 'AirTube'
tube.rotation_euler = (0, 0.3, 0)
tube.data.materials.append(rubber_mat)

# ─── Side panels / enclosure hints ──────────────────────────
# Left side panel
bpy.ops.mesh.primitive_cube_add(size=1, location=(-1.55, 0, 0.15))
lpanel = bpy.context.active_object
lpanel.name = 'LeftPanel'
lpanel.scale = (0.02, 2.05, 0.35)
lpanel.data.materials.append(bed_mat)

# Right side panel
bpy.ops.mesh.primitive_cube_add(size=1, location=(1.55, 0, 0.15))
rpanel = bpy.context.active_object
rpanel.name = 'RightPanel'
rpanel.scale = (0.02, 2.05, 0.35)
rpanel.data.materials.append(bed_mat)

# ─── Rubber feet ────────────────────────────────────────────
for x in [-1.3, 1.3]:
    for y in [-0.85, 0.85]:
        bpy.ops.mesh.primitive_cylinder_add(radius=0.06, depth=0.04, location=(x, y, -0.23))
        foot = bpy.context.active_object
        foot.name = f'Foot_{x}_{y}'
        foot.data.materials.append(rubber_mat)

# ─── Lighting ───────────────────────────────────────────────

# Key light (warm, from upper right)
bpy.ops.object.light_add(type='AREA', location=(2, -1.5, 2.5))
key = bpy.context.active_object
key.name = 'KeyLight'
key.data.energy = 100
key.data.color = (1.0, 0.95, 0.9)
key.data.size = 1.5
key.rotation_euler = (math.radians(45), math.radians(15), math.radians(-30))

# Fill light (cool, from left)
bpy.ops.object.light_add(type='AREA', location=(-2, -0.5, 1.5))
fill = bpy.context.active_object
fill.name = 'FillLight'
fill.data.energy = 30
fill.data.color = (0.85, 0.9, 1.0)
fill.data.size = 2.0
fill.rotation_euler = (math.radians(50), math.radians(-20), math.radians(20))

# Rim light (from behind, subtle)
bpy.ops.object.light_add(type='AREA', location=(0, 2, 1.5))
rim = bpy.context.active_object
rim.name = 'RimLight'
rim.data.energy = 40
rim.data.color = (0.8, 0.95, 1.0)
rim.data.size = 3.0
rim.rotation_euler = (math.radians(-50), 0, 0)

# ─── Camera ─────────────────────────────────────────────────
bpy.ops.object.camera_add(location=(1.8, -2.2, 1.8))
camera = bpy.context.active_object
camera.name = 'Camera'

# Point camera at workpiece
direction = bpy.data.objects['Workpiece'].location - camera.location
rot_quat = direction.to_track_quat('-Z', 'Y')
camera.rotation_euler = rot_quat.to_euler()

camera.data.lens = 35
camera.data.clip_end = 100
bpy.context.scene.camera = camera

# ─── Apply modifiers and export ─────────────────────────────
# Apply all modifiers
for obj in bpy.data.objects:
    if obj.type == 'MESH':
        bpy.context.view_layer.objects.active = obj
        for mod in obj.modifiers:
            try:
                bpy.ops.object.modifier_apply(modifier=mod.name)
            except:
                pass

# Select all mesh objects
bpy.ops.object.select_all(action='DESELECT')
for obj in bpy.data.objects:
    if obj.type == 'MESH':
        obj.select_set(True)

# Export GLTF
output_path = os.path.expanduser('/Users/zacharydemillo/Desktop/VURMZ Business/Website/Main Site/public/models/laser-machine.glb')
bpy.ops.export_scene.gltf(
    filepath=output_path,
    use_selection=True,
    export_format='GLB',
    export_apply=True,
    export_materials='EXPORT',
    export_draco_mesh_compression_enable=True,
    export_draco_mesh_compression_level=6,
)

print(f"Exported to {output_path}")
print(f"Objects: {len([o for o in bpy.data.objects if o.type == 'MESH'])}")
