import {
  NextFunction, Request, Response, Router,
} from 'express';
import { IAdminService } from '../../services/services';

class AdminRoute {
  constructor(private adminService: IAdminService) {
    this.adminService = adminService;
  }

  initRoutes() {
    return Router()
      .get('/rewrite', this.rewriteData.bind(this))
      .get('/metrics', this.getAllMetrics.bind(this));
  }

  private async rewriteData(req: Request, res: Response, next: NextFunction) {
    try {
      await this.adminService.rewriteData();
      res.status(200).json({ message: 'Data successfully rewrote!' });
    } catch (error) {
      next(error);
    }
  }

  private async getAllMetrics(req: Request, res: Response, next: NextFunction) {
    try {
      const metrics = await this.adminService.getAllMetrics();
      res.status(200).json(metrics);
    } catch (error) {
      next(error);
    }
  }
}

export default AdminRoute;
