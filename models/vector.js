// const tf = require('@tensorflow/tfjs-node');
// let modelPromise = null;

// function getModel() {
//   if (!modelPromise) {
//     modelPromise = tf.loadGraphModel('https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v2_140_224/classification/3/default/1', { fromTFHub: true });
//   }
//   return modelPromise;
// }

// module.exports = getModel;

//Above this is the previous code

const tf = require('@tensorflow/tfjs-node');
let modelPromise = null;

function getModel() {
  if (!modelPromise) {
    modelPromise = tf.loadGraphModel("https://www.kaggle.com/models/google/mobilenet-v2/TfJs/140-224-classification/3", { fromTFHub: true })

  }
  return modelPromise;
}

module.exports = getModel;
