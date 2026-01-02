import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class AppController {
    @Get('favicon.ico')
    getFavicon(@Res() res: Response) {
        // Return 204 No Content to prevent browser errors
        res.status(204).end();
    }
}
