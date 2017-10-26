
/****************************************************************************************

	Copyright (c) 2017, Juan Carlos Labrandero.
	For conditions of distribution and use, see copyright notice in LICENSE

****************************************************************************************/

import React from 'react';
import co from 'co';

/****************************************************************************************/

class SimulationApiController {
	constructor() {
	}

	index(req, res) {
	}

	show(req, res) {
		co(function*() {
			yield req.params.validate({
				attributes: {
					id: { required: true, type: 'string' },
				},
				validationMessages: {
					id: {
						required: 'Debes proporcionar el parámetro \'id\'',
						type: 'El parámetro \'id\' no es un identificador válido'
					}
				}
			});

			return {
				simulation: {
					name: 'simulation 1',

					scene: {
						geometries: [
							{
								name: 'box1',
								type: 'box',
								width: 100,
								height: 100,
								depth: 100,
								material: { color: 0xffffff },
								position: { x:0, y:200, z:0 }
							},
							{
								name: 'box2',
								type: 'box',
								width: 150,
								height: 50,
								depth: 150,
								material: {
									color: 0x0040FF
								}
							}
						],
						models: [
							{
								name: 'table1',
								resourceName: '/models/table.json',
								position: { x:0, y:-1034, z:0 },
								textureMap: '/textures/table.png',
								material: { shininess: 255, emissive: 0x151515, specular: 0x050505, color: 0xffffff }
							}
						]
					},
					physics: {
						world: {
							timestep: 1/100,
							iterations: 8,
							broadphase: 2, // 1 brute force, 2 sweep and prune, 3 volume tree
							worldscale: 500, // scale full world
							random: true,  // randomize sample
							info: false,   // calculate statistic or not
							gravity: [0,-9.8,0]
						},
						bodies: [
							{
								size:[4702, 1, 1380],
								pos:[0,0,0]
							},
							{
								ref: 'box1',
								type:'box', // type of shape : sphere, box, cylinder
								size:[100,100,100], // size of shape
								pos:[0,2000,0], // start position in degree
								rot: 'rand',//[0,5,10], // start rotation in degree
								move:true, // dynamic or statique
								density: 0.1,
								friction: 0.2,
								restitution: 0.5,
								belongsTo: 1, // The bits of the collision groups to which the shape belongs.
								collidesWith: 0xffffffff // The bits of the collision groups with which the shape collides.
							}
						]
					}
				}
			};
		}).then(obj=>{
			res.json(obj);
		}).catch(err=>{
			if(!err.status) {err.status = 500;}
			res.status(err.status).json(err);
		});
	}
}

export {SimulationApiController};