import { TestBed } from '@angular/core/testing';

import { CatalogueServiceService } from './catalogue-service.service';

describe('CatalogueServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CatalogueServiceService = TestBed.get(CatalogueServiceService);
    expect(service).toBeTruthy();
  });
});
