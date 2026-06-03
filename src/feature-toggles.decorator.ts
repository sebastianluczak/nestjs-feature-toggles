import { SetMetadata } from "@nestjs/common";

export const FEATURE_FLAG_KEY = "featureToggle";
export const FEATURE_FLAG_CONSUMER_KEY = "featureToggleConsumer";

export function FeatureToggle(featureName: string, toggleType: 'release' | 'experiment' | 'ops' = 'ops') {
  return SetMetadata(FEATURE_FLAG_KEY, { featureName, toggleType });
}

export function FeatureToggleConsumer() {
  return SetMetadata(FEATURE_FLAG_CONSUMER_KEY, true);
}