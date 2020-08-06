import { Request, Response } from 'express';
import knex from '../database/connection';
import localhostDev from '../config/localhostAddress';


class PointsController {

    async index(request:Request, response: Response) {

        const { city, uf, items } = request.query;

        const points = await knex('points')
            .join('point_items', 'points.id', '=', 'point_items.point_id')
            .select('points.*')
            .modify((q) => {
                if ( city ) { q.where('city', String(city)); }
            })
            .modify((q) => {
                if ( uf ) { q.where('uf', String(uf)); }
            })
            .modify((q) => {
                if ( items ) {
                    const parsedItems = String(items).split(',').map(item => Number(item.trim()));
                    q.whereIn('point_items.item_id', parsedItems);
                }
            })
            .distinct();

        for (let i=0; i<points.length; i++) {

            const items = await knex('items')
                .join('point_items', 'items.id', '=', 'point_items.item_id')
                .where('point_items.point_id', points[i].id)
                .select('items.title');
            
            points[i].items = items.map(item => (item.title)).join(', ');

            // points[i].image_url = `http://192.168.0.2:3333/uploads/points/${points[i].image}`;
            points[i].image_url = `http://${localhostDev}/uploads/points/${points[i].image}`;
        }

        return response.json(points);
    }


    async create(request: Request, response: Response) {

        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = request.body;

        const trx = await knex.transaction();

        const point = {
            image: request.file.filename,
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf
        };
    
        const insertedIds = await trx('points').insert(point);
    
        const point_id = insertedIds[0];
    
        // const pointItems = items.map((item_id: number) => {
        const pointItems = items.split(',').map((item: string) => Number(item.trim())).map((item_id: number) => {
            return {
                item_id,
                point_id: point_id,
            }
        });
    
        await trx('point_items').insert(pointItems);

        await trx.commit();

        return trx.isCompleted() ? response.json({
            success: true,
            id: point_id,
            ...point,
            items: items
        }) : response.json({ success: false }) ;
    }


    async show (request: Request, response: Response) {
        
        const {id} = request.params;

        const point = await knex('points').where('id', id).first();

        if ( !point ) {
            return response.status(400).json({ message: 'Point not found.'});
        }
        
        const serializedPoint = {
            ...point,
            // image_url:  `http://192.168.0.2:3333/uploads/points/${point.image}`
            image_url:  `http://${localhostDev}/uploads/points/${point.image}`
        };

        const items = await knex('items')
            .join('point_items', 'items.id', '=', 'point_items.item_id')
            .where('point_items.point_id', id)
            .select('items.title');

        return response.json({ 
            point: serializedPoint, 
            items 
        });
    }
}

export default PointsController;