import '@angular/compiler';
import '@analogjs/vitest-angular/setup-zone';

import {
  BrowserTestingModule,
  platformBrowserTesting,
} from '@angular/platform-browser/testing';
import { getTestBed } from '@angular/core/testing';

getTestBed().resetTestEnvironment();
getTestBed().initTestEnvironment(
  BrowserTestingModule,
  platformBrowserTesting()
);
