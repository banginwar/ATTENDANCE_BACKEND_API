export function cosineSimilarity(vecA, vecB) {
    const a = tf.tensor1d(vecA);
    const b = tf.tensor1d(vecB);
    const dotProduct = tf.sum(tf.mul(a, b));
    const normA = tf.norm(a);
    const normB = tf.norm(b);
    const similarity = dotProduct.div(normA.mul(normB));
    return similarity.arraySync();
  }