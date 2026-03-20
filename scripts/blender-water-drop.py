"""
Blender script: Render a photorealistic water droplet with splash.
Outputs transparent PNG sequence (60 frames).
Run: /Applications/Blender.app/Contents/MacOS/Blender -b -P scripts/blender-water-drop.py
"""
import bpy
import math
import os

bpy.ops.wm.read_factory_settings(use_empty=True)

scene = bpy.context.scene
scene.render.engine = 'CYCLES'
scene.cycles.device = 'CPU'
scene.cycles.samples = 48
scene.render.resolution_x = 400
scene.render.resolution_y = 600
scene.render.film_transparent = True
scene.render.image_settings.file_format = 'PNG'
scene.render.image_settings.color_mode = 'RGBA'
scene.frame_start = 1
scene.frame_end = 60

output_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'public', 'aero', 'drop_')
scene.render.filepath = output_dir

# ── Water Drop shape (teardrop) ──
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.5, segments=48, ring_count=24, location=(0, 0, 0.8))
drop = bpy.context.active_object
drop.name = 'WaterDrop'
bpy.ops.object.shade_smooth()

# Stretch into teardrop via lattice
bpy.ops.object.modifier_add(type='CAST')
drop.modifiers['Cast'].cast_type = 'SPHERE'
drop.modifiers['Cast'].factor = 0.3

# Scale to teardrop
drop.scale = (0.8, 0.8, 1.3)
bpy.ops.object.transform_apply(scale=True)

# Water material
mat = bpy.data.materials.new(name='Water')
mat.use_nodes = True
nodes = mat.node_tree.nodes
links = mat.node_tree.links
nodes.clear()

glass = nodes.new('ShaderNodeBsdfGlass')
glass.inputs['Color'].default_value = (0.85, 0.95, 1.0, 1.0)
glass.inputs['Roughness'].default_value = 0.0
glass.inputs['IOR'].default_value = 1.333  # Water IOR

output = nodes.new('ShaderNodeOutputMaterial')
links.new(glass.outputs['BSDF'], output.inputs['Surface'])

drop.data.materials.append(mat)

# ── Small splash droplets ──
import random
random.seed(42)
for i in range(8):
    angle = (i / 8) * math.pi * 2
    r = 0.6 + random.uniform(-0.1, 0.2)
    x = math.cos(angle) * r
    y = math.sin(angle) * r
    z = random.uniform(-0.3, 0.2)
    size = random.uniform(0.04, 0.12)

    bpy.ops.mesh.primitive_uv_sphere_add(radius=size, segments=16, ring_count=8, location=(x, y, z))
    tiny = bpy.context.active_object
    tiny.name = f'Splash_{i}'
    bpy.ops.object.shade_smooth()
    tiny.data.materials.append(mat)

    # Animate outward
    tiny.location = (x * 0.3, y * 0.3, z + 0.5)
    tiny.keyframe_insert(data_path='location', frame=1)
    tiny.location = (x, y, z)
    tiny.keyframe_insert(data_path='location', frame=30)
    tiny.location = (x * 1.3, y * 1.3, z - 0.4)
    tiny.keyframe_insert(data_path='location', frame=60)

# ── Drop animation: gentle bob ──
drop.location = (0, 0, 0.8)
drop.keyframe_insert(data_path='location', frame=1)
drop.location = (0, 0, 1.0)
drop.keyframe_insert(data_path='location', frame=30)
drop.location = (0, 0, 0.8)
drop.keyframe_insert(data_path='location', frame=60)

# Gentle wobble
drop.rotation_euler = (0, 0, 0)
drop.keyframe_insert(data_path='rotation_euler', frame=1)
drop.rotation_euler = (math.radians(3), math.radians(-2), math.radians(5))
drop.keyframe_insert(data_path='rotation_euler', frame=20)
drop.rotation_euler = (math.radians(-2), math.radians(3), math.radians(-3))
drop.keyframe_insert(data_path='rotation_euler', frame=40)
drop.rotation_euler = (0, 0, 0)
drop.keyframe_insert(data_path='rotation_euler', frame=60)

# ── Lighting ──
bpy.ops.object.light_add(type='AREA', location=(2, -2, 4))
key = bpy.context.active_object
key.data.energy = 150
key.data.size = 3
key.data.color = (1.0, 0.98, 0.95)

bpy.ops.object.light_add(type='AREA', location=(-2, 2, 2))
fill = bpy.context.active_object
fill.data.energy = 60
fill.data.size = 4
fill.data.color = (0.7, 0.9, 1.0)

# Back rim
bpy.ops.object.light_add(type='AREA', location=(0, 3, 1))
rim = bpy.context.active_object
rim.data.energy = 40
rim.data.size = 2
rim.data.color = (0.8, 0.95, 1.0)

# ── Camera ──
bpy.ops.object.camera_add(location=(0, -3, 1))
cam = bpy.context.active_object
cam.rotation_euler = (math.radians(78), 0, 0)
scene.camera = cam

# ── World ──
world = bpy.data.worlds.new('DropWorld')
scene.world = world
world.use_nodes = True
wn = world.node_tree.nodes
wn.clear()
bg = wn.new('ShaderNodeBackground')
bg.inputs['Color'].default_value = (0, 0, 0, 1)
bg.inputs['Strength'].default_value = 0.0
wo = wn.new('ShaderNodeOutputWorld')
world.node_tree.links.new(bg.outputs['Background'], wo.inputs['Surface'])

bpy.ops.render.render(animation=True)
print("Water drop render complete!")
