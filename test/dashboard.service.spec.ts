import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { DashboardService } from 'src/admin/dashboard.service';
import { Order } from 'src/orders/order.model';
import { Product } from 'src/products/product.model';
import { User } from 'src/user/user.model';

describe('DashboardService', () => {
  let service: DashboardService;
  let orderModel: typeof Order;
  let productModel: typeof Product;
  let userModel: typeof User;
  let sequelize: Sequelize;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        DashboardService,
        {
          provide: getModelToken(Order),
          useValue: {
            count: jest.fn(),
            sum: jest.fn(),
            findAll: jest.fn(),
          },
        },
        {
          provide: getModelToken(Product),
          useValue: {
            count: jest.fn(),
          },
        },
        {
          provide: getModelToken(User),
          useValue: {
            count: jest.fn(),
          },
        },
        {
          provide: Sequelize,
          useValue: {
            query: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
    orderModel = module.get<typeof Order>(getModelToken(Order));
    productModel = module.get<typeof Product>(getModelToken(Product));
    userModel = module.get<typeof User>(getModelToken(User));
    sequelize = module.get<Sequelize>(Sequelize);
  });

  describe('getStats', () => {
    it('должен возвращать статистику', async () => {
      (orderModel.count as jest.Mock).mockResolvedValue(10);
      (orderModel.sum as jest.Mock).mockResolvedValue(5000);
      (userModel.count as jest.Mock).mockResolvedValue(25);
      (productModel.count as jest.Mock).mockResolvedValue(42);

      const result = await service.getStats();

      expect(result).toEqual({
        ordersCount: 10,
        revenue: 5000,
        usersCount: 25,
        productsCount: 42,
      });
    });

    it('должен обрабатывать нулевые значения', async () => {
      (orderModel.count as jest.Mock).mockResolvedValue(0);
      (orderModel.sum as jest.Mock).mockResolvedValue(null);
      (userModel.count as jest.Mock).mockResolvedValue(0);
      (productModel.count as jest.Mock).mockResolvedValue(0);

      const result = await service.getStats();

      expect(result).toEqual({
        ordersCount: 0,
        revenue: 0,
        usersCount: 0,
        productsCount: 0,
      });
    });
  });

  describe('getRecentOrders', () => {
    it('должен возвращать последние заказы', async () => {
      const mockOrders = [{ id: 1 }, { id: 2 }] as Order[];
      (orderModel.findAll as jest.Mock).mockResolvedValue(mockOrders);

      const result = await service.getRecentOrders(2);

      expect(orderModel.findAll).toHaveBeenCalledWith({
        order: [['createdAt', 'DESC']],
        limit: 2,
        include: [{ all: true }],
      });
      expect(result).toEqual(mockOrders);
    });

    it('должен использовать лимит по умолчанию', async () => {
      await service.getRecentOrders();

      expect(orderModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          limit: 5,
        }),
      );
    });
  });

  describe('getTopProducts', () => {
    it('должен возвращать топ продуктов', async () => {
      const mockResult = [
        { productId: 1, totalSold: 50 },
        { productId: 2, totalSold: 30 },
      ];
      (sequelize.query as jest.Mock).mockResolvedValue(mockResult);

      const result = await service.getTopProducts(2);

      expect(sequelize.query).toHaveBeenCalledWith(`
      SELECT 
        product_id AS "productId",
        SUM(quantity) AS "totalSold"
      FROM order_items
      GROUP BY product_id
      ORDER BY "totalSold" DESC
      LIMIT 2
    `);
      expect(result).toEqual(mockResult);
    });

    it('должен использовать лимит по умолчанию', async () => {
      await service.getTopProducts();

      expect(sequelize.query).toHaveBeenCalledWith(
        expect.stringContaining('LIMIT 5'),
      );
    });
  });
});
