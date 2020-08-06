import { Request, Response } from 'express';
import knex from '../database/connection';
import localhostDev from '../config/localhostAddress';

class ItemsController {

    async index(request: Request, response: Response) {

        const items = await knex('items').select('*');

        const serializedItems = items.map(item => {
            return {
                id:         item.id,
                title:      item.title,
                // image_url:  `http://localhost:3333/uploads/items/${item.image}`
                // image_url:  `http://192.168.0.2:3333/uploads/items/${item.image}`
                image_url:  `http://${localhostDev}/uploads/items/${item.image}`
            }
        });
        
        return response.json(serializedItems);
    }
}

export default ItemsController;