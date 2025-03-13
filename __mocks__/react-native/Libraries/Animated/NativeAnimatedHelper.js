module.exports = {
  API: {
    startOperationBatch: jest.fn(),
    finishOperationBatch: jest.fn(),
    createNode: jest.fn(),
    connectNodes: jest.fn(),
    disconnectNodes: jest.fn(),
    connectNodeToView: jest.fn(),
    disconnectNodeFromView: jest.fn(),
    dropView: jest.fn(),
  },
  addListener: jest.fn(),
  removeListeners: jest.fn(),
}; 