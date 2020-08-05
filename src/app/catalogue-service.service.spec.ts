import { TestBed } from '@angular/core/testing';

import { CatalogueService } from './services/catalogue.service';

describe('CatalogueServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CatalogueService= TestBed.get(CatalogueService);
    expect(service).toBeTruthy();
  });
});
