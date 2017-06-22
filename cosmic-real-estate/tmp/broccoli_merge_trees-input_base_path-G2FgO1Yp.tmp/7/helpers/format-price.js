import Ember from 'ember';

export function formatPrice([value, ...rest]) {
  return '$' + value.toLocaleString();
}

export default Ember.Helper.helper(formatPrice);
