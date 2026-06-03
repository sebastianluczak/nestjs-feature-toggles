import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { DiscoveryService, Reflector } from "@nestjs/core";
import { FEATURE_FLAG_KEY, FEATURE_FLAG_CONSUMER_KEY } from "./feature-toggles.decorator";
import { FeatureTogglesClient } from "./feature-toggles.client";

@Injectable()
export class FeatureToggleScanner implements OnModuleInit {
  private readonly logger = new Logger(FeatureToggleScanner.name);

  constructor(
    private readonly discovery: DiscoveryService,
    private readonly reflector: Reflector,
    private readonly client: FeatureTogglesClient,
  ) {}

  onModuleInit() {
    for (const wrapper of this.discovery.getProviders()) {
      if (
        !wrapper.metatype ||
        !this.reflector.get(FEATURE_FLAG_CONSUMER_KEY, wrapper.metatype)
      ) {
        continue;
      }

      const instance = wrapper.instance as Record<string, unknown>;
      if (!instance) continue;

      const prototype = Object.getPrototypeOf(instance) as object;
      if (!prototype) continue;

      for (const methodName of Object.getOwnPropertyNames(prototype)) {
        if (methodName === 'constructor') continue;

        const method = (prototype as Record<string, unknown>)[methodName];
        if (typeof method !== 'function') continue;

        const toggleMetadata = this.reflector.get<{ featureName: string; toggleType: 'release' | 'experiment' | 'ops' }>(
          FEATURE_FLAG_KEY,
          method,
        );
        if (!toggleMetadata) continue;

        const { featureName, toggleType } = toggleMetadata;
        const originalMethod = (method as (...args: unknown[]) => unknown).bind(instance);

        this.logger.log(
          `Wrapping ${String(wrapper.name)}.${methodName} behind feature flag '${featureName}' (${toggleType})`,
        );
        instance[methodName] = (...args: unknown[]) => {
          if (!this.client.getToggle(featureName, toggleType)) {
            this.logger.debug(
              `Feature '${featureName}' is disabled — skipping ${String(wrapper.name)}.${methodName}`,
            );
            return;
          }
          return originalMethod(...args);
        };
      }
    }
  }
}