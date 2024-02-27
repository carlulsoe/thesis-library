var attention_id = '';
/**
 * Set the current attention
 *
 * @param id sets the attention to be the provided id
 */
export function setAttention(id: string) {
  attention_id = id;
}

/**
 * Get the current attention
 *
 * @return A Promise of the current device id that has attention
 */
export function attention(): Promise<string> {
  return Promise.resolve(attention_id);
}
