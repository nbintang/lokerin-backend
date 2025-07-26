import { Test, TestingModule } from '@nestjs/testing';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

describe('RolesController', () => {
  let controller: RolesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [RolesService],
    }).compile();

    controller = module.get<RolesController>(RolesController);
  });

  it('shold be return a list of roles', async () => {
    const result = await controller.findAll();
    expect(result).toBe('This action returns all roles');
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
