import Ember from 'ember';

export function formatPrice(value) {
  return '$' + value.toLocaleString();
}

export default Ember.Helper.helper(formatPrice);
