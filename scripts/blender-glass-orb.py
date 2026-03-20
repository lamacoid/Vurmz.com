"""
Blender script: Render a glossy glass orb with water refraction + caustics.
Outputs a transparent PNG sequence (60 frames) for a looping animation.
Run: /Applications/Blender.app/Contents/MacOS/Blender -b -P scripts/blender-glass-orb.py
"""
import bpy
import math
import os

# ── Clean scene ──
bpy.ops.wm.read_factory_settings(use_empty=True)

scene = bpy.context.scene
scene.render.engine = 'CYCLES'
scene.cycles.device = 'CPU'
scene.cycles.samples = 64
scene.render.resolution_x = 512
scene.render.resolution_y = 512
scene.render.film_transparent = True
scene.render.image_settings.file_format = 'PNG'
scene.render.image_settings.color_mode = 'RGBA'
scene.frame_start = 1
scene.frame_end = 60

output_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'public', 'aero', 'orb_')
scene.render.filepath = output_dir

# ── Glass Orb ──
bpy.ops.mesh.primitive_uv_sphere_add(radius=1.0, segments=64, ring_count=32, location=(0, 0, 0))
orb = bpy.context.active_object
orb.name = 'GlassOrb'

# Smooth shading
bpy.ops.object.shade_smooth()

# Glass material
mat = bpy.data.materials.new(name='AeroGlass')
mat.use_nodes = True
nodes = mat.node_tree.nodes
links = mat.node_tree.links
nodes.clear()

# Glass BSDF
glass = nodes.new('ShaderNodeBsdfGlass')
glass.inputs['Color'].default_value = (0.7, 0.92, 1.0, 1.0)  # Light aqua
glass.inputs['Roughness'].default_value = 0.02
glass.inputs['IOR'].default_value = 1.45

# Glossy for extra sheen
glossy = nodes.new('ShaderNodeBsdfGlossy')
glossy.inputs['Color'].default_value = (0.9, 0.98, 1.0, 1.0)
glossy.inputs['Roughness'].default_value = 0.05

# Mix glass and glossy
mix = nodes.new('ShaderNodeMixShader')
mix.inputs['Fac'].default_value = 0.15

# Fresnel for realistic reflections
fresnel = nodes.new('ShaderNodeFresnel')
fresnel.inputs['IOR'].default_value = 1.5

# Output
output = nodes.new('ShaderNodeOutputMaterial')

links.new(fresnel.outputs['Fac'], mix.inputs['Fac'])
links.new(glass.outputs['BSDF'], mix.inputs[1])
links.new(glossy.outputs['BSDF'], mix.inputs[2])
links.new(mix.outputs['Shader'], output.inputs['Surface'])

orb.data.materials.append(mat)

# ── Inner glow sphere ──
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.7, segments=32, ring_count=16, location=(0, 0, 0))
inner = bpy.context.active_object
inner.name = 'InnerGlow'
bpy.ops.object.shade_smooth()

glow_mat = bpy.data.materials.new(name='InnerGlow')
glow_mat.use_nodes = True
gn = glow_mat.node_tree.nodes
gl = glow_mat.node_tree.links
gn.clear()

emission = gn.new('ShaderNodeEmission')
emission.inputs['Color'].default_value = (0.3, 0.8, 0.9, 1.0)
emission.inputs['Strength'].default_value = 2.0

transparent = gn.new('ShaderNodeBsdfTransparent')
mix2 = gn.new('ShaderNodeMixShader')
mix2.inputs['Fac'].default_value = 0.85

output2 = gn.new('ShaderNodeOutputMaterial')
gl.new(transparent.outputs['BSDF'], mix2.inputs[1])
gl.new(emission.outputs['Emission'], mix2.inputs[2])
gl.new(mix2.outputs['Shader'], output2.inputs['Surface'])

inner.data.materials.append(glow_mat)

# ── Lighting ──
# Key light (sun-like, warm)
bpy.ops.object.light_add(type='AREA', location=(3, -2, 4))
key = bpy.context.active_object
key.data.energy = 200
key.data.size = 3
key.data.color = (1.0, 0.95, 0.9)

# Fill light (blue, aqua tint)
bpy.ops.object.light_add(type='AREA', location=(-3, 2, 2))
fill = bpy.context.active_object
fill.data.energy = 80
fill.data.size = 4
fill.data.color = (0.6, 0.85, 1.0)

# Rim light (white)
bpy.ops.object.light_add(type='POINT', location=(0, -3, 0))
rim = bpy.context.active_object
rim.data.energy = 50
rim.data.color = (1.0, 1.0, 1.0)

# ── Camera ──
bpy.ops.object.camera_add(location=(0, -3.5, 0.5))
cam = bpy.context.active_object
cam.rotation_euler = (math.radians(82), 0, 0)
scene.camera = cam

# ── Animation: Gentle rotation + bob ──
orb.rotation_euler = (0, 0, 0)
orb.keyframe_insert(data_path='rotation_euler', frame=1)
orb.rotation_euler = (math.radians(5), math.radians(360), math.radians(3))
orb.keyframe_insert(data_path='rotation_euler', frame=60)

orb.location = (0, 0, 0)
orb.keyframe_insert(data_path='location', frame=1)
orb.location = (0, 0, 0.15)
orb.keyframe_insert(data_path='location', frame=30)
orb.location = (0, 0, 0)
orb.keyframe_insert(data_path='location', frame=60)

# Make rotation linear
for fc in orb.animation_data.action.fcurves:
    for kf in fc.keyframe_points:
        kf.interpolation = 'LINEAR' if 'rotation' in fc.data_path else 'BEZIER'

# Same for inner glow
inner.rotation_euler = (0, 0, 0)
inner.keyframe_insert(data_path='rotation_euler', frame=1)
inner.rotation_euler = (math.radians(-3), math.radians(-180), math.radians(5))
inner.keyframe_insert(data_path='rotation_euler', frame=60)

# ── World: Transparent ──
world = bpy.data.worlds.new('AeroWorld')
scene.world = world
world.use_nodes = True
wn = world.node_tree.nodes
wn.clear()
bg = wn.new('ShaderNodeBackground')
bg.inputs['Color'].default_value = (0, 0, 0, 1)
bg.inputs['Strength'].default_value = 0.0
wo = wn.new('ShaderNodeOutputWorld')
world.node_tree.links.new(bg.outputs['Background'], wo.inputs['Surface'])

# ── Render animation ──
bpy.ops.render.render(animation=True)
print("Glass orb render complete!")
