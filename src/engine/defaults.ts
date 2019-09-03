import { Schema } from '../deploy/schema';

export enum npmAccess {
  public = 'public',
  restricted = 'restricted'
}

export const defaults: Schema = {
  tag: undefined,
  access: npmAccess.public,
  otp: undefined,
  dryRun: false
};
