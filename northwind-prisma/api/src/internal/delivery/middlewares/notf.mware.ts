import { Request, Response } from 'express';

const notfMiddleware = (req: Request, res: Response) => res.status(404).json({ message: 'Not Found!' });

export default notfMiddleware;
