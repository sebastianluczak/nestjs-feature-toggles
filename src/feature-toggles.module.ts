import {
  DynamicModule,
  Module,
  MiddlewareConsumer,
  NestModule,
} from '@nestjs/common';
import { FeatureTogglesClient } from './feature-toggles.client';
import { FeatureTogglesParser } from './feature-toggles.parser';
import { FeatureTogglesProvider } from './feature-toggles.provider';
import { FeatureToggleScanner } from './feature-toggle.scanner';
import { DiscoveryModule } from '@nestjs/core';

@Module({})
export class FeatureTogglesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Configure middleware if needed
  }

  static forRoot(): DynamicModule {
    return {
      module: FeatureTogglesModule,
      imports: [DiscoveryModule],
      providers: [FeatureTogglesClient, FeatureTogglesParser, FeatureTogglesProvider, FeatureToggleScanner],
      exports: [FeatureTogglesClient],
    };
  }
}