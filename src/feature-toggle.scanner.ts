import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { DiscoveryService, Reflector } from "@nestjs/core";
import { FEATURE_TOGGLE_KEY, FEATURE_TOGGLE_PROVIDER } from "./feature-toggles.decorator";

@Injectable()
export class FeatureToggleScanner implements OnModuleInit {
  private readonly logger = new Logger(FeatureToggleScanner.name);

  constructor(
    private readonly discovery: DiscoveryService,
    private readonly reflector: Reflector,
  ) {}

  onModuleInit() {
    this.logger.log(`Starting feature toggle scan for ${FEATURE_TOGGLE_PROVIDER} providers...`);
    for (const wrapper of this.discovery.getProviders()) {
      if (
        !wrapper.metatype ||
        !this.reflector.get(
          FEATURE_TOGGLE_PROVIDER,
          wrapper.metatype,
        )
      ) {
        continue;
      }

      const metadata = this.reflector.get(
        FEATURE_TOGGLE_PROVIDER,
        wrapper.metatype,
      );

      if (metadata) {
        this.logger.log(`FOUND: ${wrapper.name}`);
        const instance = wrapper.instance;
        const prototype = Object.getPrototypeOf(instance);
        this.logger.log(`Prototype of ${wrapper.name}: ${prototype ? 'exists' : 'does not exist'}`);

        for (const methodName of Object.getOwnPropertyNames(prototype)) {
          this.logger.log(`Checking method: ${methodName} of provider: ${wrapper.name}`);
          const method = prototype[methodName];

          try {
            const toggle = this.reflector.get(
              FEATURE_TOGGLE_KEY,
              method,
            );
            this.logger.log(
              `${wrapper.name}.${methodName} uses`,
              toggle,
            );
          } catch (error) {
            this.logger.error(`Error retrieving metadata for method: ${methodName} of provider: ${wrapper.name}`, error);
            continue;
          }
        }
      }
    }
  }
}