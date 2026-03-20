"""
Blender script: Render animated underwater caustic light pattern.
Outputs transparent PNG sequence (90 frames) for looping background texture.
Run: /Applications/Blender.app/Contents/MacOS/Blender -b -P scripts/blender-caustics.py
"""
import bpy
import math
import os

bpy.ops.wm.read_factory_settings(use_empty=True)

scene = bpy.context.scene
scene.render.engine = 'CYCLES'
scene.cycles.device = 'CPU'
scene.cycles.samples = 32
scene.render.resolution_x = 800
scene.render.resolution_y = 800
scene.render.film_transparent = True
scene.render.image_settings.file_format = 'PNG'
scene.render.image_settings.color_mode = 'RGBA'
scene.frame_start = 1
scene.frame_end = 90

output_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'public', 'aero', 'caustic_')
scene.render.filepath = output_dir

# ── Water surface (displaced plane) ──
bpy.ops.mesh.primitive_plane_add(size=10, location=(0, 0, 2))
water = bpy.context.active_object
water.name = 'WaterSurface'

# Subdivide for displacement
bpy.ops.object.mode_set(mode='EDIT')
for _ in range(6):
    bpy.ops.mesh.subdivide()
bpy.ops.object.mode_set(mode='OBJECT')

# Water material with animated noise displacement
mat = bpy.data.materials.new(name='CausticWater')
mat.use_nodes = True
nodes = mat.node_tree.nodes
links = mat.node_tree.links
nodes.clear()

# Glass for refraction
glass = nodes.new('ShaderNodeBsdfGlass')
glass.inputs['Color'].default_value = (0.8, 0.95, 1.0, 1.0)
glass.inputs['Roughness'].default_value = 0.0
glass.inputs['IOR'].default_value = 1.333

output = nodes.new('ShaderNodeOutputMaterial')
links.new(glass.outputs['BSDF'], output.inputs['Surface'])

# Displacement via noise
tex_coord = nodes.new('ShaderNodeTexCoord')
noise = nodes.new('ShaderNodeTexNoise')
noise.inputs['Scale'].default_value = 3.0
noise.inputs['Detail'].default_value = 6.0
noise.inputs['Roughness'].default_value = 0.6
noise.inputs['Distortion'].default_value = 1.5

disp = nodes.new('ShaderNodeDisplacement')
disp.inputs['Scale'].default_value = 0.3
disp.inputs['Midlevel'].default_value = 0.5

links.new(tex_coord.outputs['Object'], noise.inputs['Vector'])
links.new(noise.outputs['Fac'], disp.inputs['Height'])
links.new(disp.outputs['Displacement'], output.inputs['Displacement'])

mat.cycles.displacement_method = 'BOTH'
water.data.materials.append(mat)

# Animate noise offset for water movement
mapping = nodes.new('ShaderNodeMapping')
links.new(tex_coord.outputs['Object'], mapping.inputs['Vector'])
links.new(mapping.outputs['Vector'], noise.inputs['Vector'])

mapping.inputs['Location'].default_value = (0, 0, 0)
mapping.inputs['Location'].keyframe_insert(data_path='default_value', frame=1)
mapping.inputs['Location'].default_value = (2, 1.5, 0.5)
mapping.inputs['Location'].keyframe_insert(data_path='default_value', frame=90)

# ── Floor to catch caustics ──
bpy.ops.mesh.primitive_plane_add(size=10, location=(0, 0, -1))
floor = bpy.context.active_object
floor.name = 'Floor'

floor_mat = bpy.data.materials.new(name='FloorMat')
floor_mat.use_nodes = True
fn = floor_mat.node_tree.nodes
fl = floor_mat.node_tree.links
fn.clear()

diffuse = fn.new('ShaderNodeBsdfDiffuse')
diffuse.inputs['Color'].default_value = (1, 1, 1, 1)
fout = fn.new('ShaderNodeOutputMaterial')
fl.new(diffuse.outputs['BSDF'], fout.inputs['Surface'])
floor.data.materials.append(floor_mat)

# ── Light (sun through water) ──
bpy.ops.object.light_add(type='SUN', location=(0, 0, 5))
sun = bpy.context.active_object
sun.data.energy = 5
sun.data.color = (1.0, 0.98, 0.95)
sun.rotation_euler = (math.radians(-30), math.radians(10), 0)

# Enable caustics
scene.cycles.caustics_reflective = True
scene.cycles.caustics_refractive = True

# ── Camera (top-down on floor to capture caustic pattern) ──
bpy.ops.object.camera_add(location=(0, 0, 1))
cam = bpy.context.active_object
cam.rotation_euler = (0, 0, 0)  # Looking straight down
cam.data.type = 'ORTHO'
cam.data.ortho_scale = 6
scene.camera = cam

# ── World ──
world = bpy.data.worlds.new('CausticWorld')
scene.world = world
world.use_nodes = True
wn = world.node_tree.nodes
wn.clear()
bg = wn.new('ShaderNodeBackground')
bg.inputs['Color'].default_value = (0.5, 0.7, 0.9, 1)
bg.inputs['Strength'].default_value = 0.3
wo = wn.new('ShaderNodeOutputWorld')
world.node_tree.links.new(bg.outputs['Background'], wo.inputs['Surface'])

bpy.ops.render.render(animation=True)
print("Caustics render complete!")
