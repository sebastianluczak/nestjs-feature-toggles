import { Injectable } from "@nestjs/common";
import { FeatureTogglesProvider } from "./feature-toggles.provider";

@Injectable()
export class FeatureTogglesClient {
  // See: https://martinfowler.com/articles/feature-toggles.html
  private readonly supportedToggles = ["release", "experiment", "ops"];

  constructor(private readonly provider: FeatureTogglesProvider) {}

  getToggle(featureName: string, toggleType: 'release' | 'experiment' | 'ops' = 'ops'): boolean {
    if (!this.supportedToggles.includes(toggleType)) {
      throw new Error(`Unsupported toggle type: ${toggleType}`);
    }
    switch (toggleType) {
      case 'release':
        return this.provider.getReleaseToggle(featureName);
      case 'experiment':
        return this.provider.getExperimentToggle(featureName);
      case 'ops':
        return this.provider.getOpsToggle(featureName);
      default:
        const _exhaustiveCheck: never = toggleType;
        return _exhaustiveCheck;
    }
  }
}