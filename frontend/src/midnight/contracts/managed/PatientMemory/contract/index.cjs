'use strict';
const __compactRuntime = require('@midnight-ntwrk/compact-runtime');
const expectedRuntimeVersionString = '0.8.1';
const expectedRuntimeVersion = expectedRuntimeVersionString.split('-')[0].split('.').map(Number);
const actualRuntimeVersion = __compactRuntime.versionString.split('-')[0].split('.').map(Number);
if (expectedRuntimeVersion[0] != actualRuntimeVersion[0]
     || (actualRuntimeVersion[0] == 0 && expectedRuntimeVersion[1] != actualRuntimeVersion[1])
     || expectedRuntimeVersion[1] > actualRuntimeVersion[1]
     || (expectedRuntimeVersion[1] == actualRuntimeVersion[1] && expectedRuntimeVersion[2] > actualRuntimeVersion[2]))
   throw new __compactRuntime.CompactError(`Version mismatch: compiled code expects ${expectedRuntimeVersionString}, runtime is ${__compactRuntime.versionString}`);
{ const MAX_FIELD = 52435875175126190479447740508185965837690552500527637822603658699938581184512n;
  if (__compactRuntime.MAX_FIELD !== MAX_FIELD)
     throw new __compactRuntime.CompactError(`compiler thinks maximum field value is ${MAX_FIELD}; run time thinks it is ${__compactRuntime.MAX_FIELD}`)
}

const _descriptor_0 = new __compactRuntime.CompactTypeUnsignedInteger(18446744073709551615n, 8);

class _tuple_0 {
  alignment() {
    return _descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment()));
  }
  fromValue(value_0) {
    return [
      _descriptor_0.fromValue(value_0),
      _descriptor_0.fromValue(value_0),
      _descriptor_0.fromValue(value_0)
    ]
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0[0]).concat(_descriptor_0.toValue(value_0[1]).concat(_descriptor_0.toValue(value_0[2])));
  }
}

const _descriptor_1 = new _tuple_0();

const _descriptor_2 = new __compactRuntime.CompactTypeBytes(32);

const _descriptor_3 = new __compactRuntime.CompactTypeUnsignedInteger(255n, 1);

const _descriptor_4 = new __compactRuntime.CompactTypeBoolean();

const _descriptor_5 = new __compactRuntime.CompactTypeUnsignedInteger(65535n, 2);

const _descriptor_6 = new __compactRuntime.CompactTypeVector(3, _descriptor_2);

const _descriptor_7 = new __compactRuntime.CompactTypeVector(2, _descriptor_2);

class _ContractAddress_0 {
  alignment() {
    return _descriptor_2.alignment();
  }
  fromValue(value_0) {
    return {
      bytes: _descriptor_2.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_2.toValue(value_0.bytes);
  }
}

const _descriptor_8 = new _ContractAddress_0();

const _descriptor_9 = new __compactRuntime.CompactTypeUnsignedInteger(340282366920938463463374607431768211455n, 16);

class Contract {
  witnesses;
  constructor(...args_0) {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`Contract constructor: expected 1 argument, received ${args_0.length}`);
    }
    const witnesses_0 = args_0[0];
    if (typeof(witnesses_0) !== 'object') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor is not an object');
    }
    if (typeof(witnesses_0.caregiverPublicKey) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named caregiverPublicKey');
    }
    this.witnesses = witnesses_0;
    this.circuits = {
      authorizeCaregiver: (...args_1) => {
        if (args_1.length !== 3) {
          throw new __compactRuntime.CompactError(`authorizeCaregiver: expected 3 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const accessLevel_0 = args_1[1];
        const durationDays_0 = args_1[2];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.originalState != undefined && contextOrig_0.transactionContext != undefined)) {
          __compactRuntime.type_error('authorizeCaregiver',
                                      'argument 1 (as invoked from Typescript)',
                                      'PatientMemory.compact line 59 char 1',
                                      'CircuitContext',
                                      contextOrig_0)
        }
        if (!(typeof(accessLevel_0) === 'bigint' && accessLevel_0 >= 0n && accessLevel_0 <= 255n)) {
          __compactRuntime.type_error('authorizeCaregiver',
                                      'argument 1 (argument 2 as invoked from Typescript)',
                                      'PatientMemory.compact line 59 char 1',
                                      'Uint<0..255>',
                                      accessLevel_0)
        }
        if (!(typeof(durationDays_0) === 'bigint' && durationDays_0 >= 0n && durationDays_0 <= 18446744073709551615n)) {
          __compactRuntime.type_error('authorizeCaregiver',
                                      'argument 2 (argument 3 as invoked from Typescript)',
                                      'PatientMemory.compact line 59 char 1',
                                      'Uint<0..18446744073709551615>',
                                      durationDays_0)
        }
        const context = { ...contextOrig_0 };
        const partialProofData = {
          input: {
            value: _descriptor_3.toValue(accessLevel_0).concat(_descriptor_0.toValue(durationDays_0)),
            alignment: _descriptor_3.alignment().concat(_descriptor_0.alignment())
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._authorizeCaregiver_0(context,
                                                    partialProofData,
                                                    accessLevel_0,
                                                    durationDays_0);
        partialProofData.output = { value: _descriptor_2.toValue(result_0), alignment: _descriptor_2.alignment() };
        return { result: result_0, context: context, proofData: partialProofData };
      },
      registerCaregiver: (...args_1) => {
        if (args_1.length !== 3) {
          throw new __compactRuntime.CompactError(`registerCaregiver: expected 3 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const cgCommit_0 = args_1[1];
        const accessLevel_0 = args_1[2];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.originalState != undefined && contextOrig_0.transactionContext != undefined)) {
          __compactRuntime.type_error('registerCaregiver',
                                      'argument 1 (as invoked from Typescript)',
                                      'PatientMemory.compact line 91 char 1',
                                      'CircuitContext',
                                      contextOrig_0)
        }
        if (!(cgCommit_0.buffer instanceof ArrayBuffer && cgCommit_0.BYTES_PER_ELEMENT === 1 && cgCommit_0.length === 32)) {
          __compactRuntime.type_error('registerCaregiver',
                                      'argument 1 (argument 2 as invoked from Typescript)',
                                      'PatientMemory.compact line 91 char 1',
                                      'Bytes<32>',
                                      cgCommit_0)
        }
        if (!(typeof(accessLevel_0) === 'bigint' && accessLevel_0 >= 0n && accessLevel_0 <= 255n)) {
          __compactRuntime.type_error('registerCaregiver',
                                      'argument 2 (argument 3 as invoked from Typescript)',
                                      'PatientMemory.compact line 91 char 1',
                                      'Uint<0..255>',
                                      accessLevel_0)
        }
        const context = { ...contextOrig_0 };
        const partialProofData = {
          input: {
            value: _descriptor_2.toValue(cgCommit_0).concat(_descriptor_3.toValue(accessLevel_0)),
            alignment: _descriptor_2.alignment().concat(_descriptor_3.alignment())
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._registerCaregiver_0(context,
                                                   partialProofData,
                                                   cgCommit_0,
                                                   accessLevel_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData };
      },
      finalizeCaregiverAudit: (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`finalizeCaregiverAudit: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const cgCommit_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.originalState != undefined && contextOrig_0.transactionContext != undefined)) {
          __compactRuntime.type_error('finalizeCaregiverAudit',
                                      'argument 1 (as invoked from Typescript)',
                                      'PatientMemory.compact line 110 char 1',
                                      'CircuitContext',
                                      contextOrig_0)
        }
        if (!(cgCommit_0.buffer instanceof ArrayBuffer && cgCommit_0.BYTES_PER_ELEMENT === 1 && cgCommit_0.length === 32)) {
          __compactRuntime.type_error('finalizeCaregiverAudit',
                                      'argument 1 (argument 2 as invoked from Typescript)',
                                      'PatientMemory.compact line 110 char 1',
                                      'Bytes<32>',
                                      cgCommit_0)
        }
        const context = { ...contextOrig_0 };
        const partialProofData = {
          input: {
            value: _descriptor_2.toValue(cgCommit_0),
            alignment: _descriptor_2.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._finalizeCaregiverAudit_0(context,
                                                        partialProofData,
                                                        cgCommit_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData };
      },
      finalizeCaregiverMetadata: (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`finalizeCaregiverMetadata: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const timestamp_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.originalState != undefined && contextOrig_0.transactionContext != undefined)) {
          __compactRuntime.type_error('finalizeCaregiverMetadata',
                                      'argument 1 (as invoked from Typescript)',
                                      'PatientMemory.compact line 126 char 1',
                                      'CircuitContext',
                                      contextOrig_0)
        }
        if (!(typeof(timestamp_0) === 'bigint' && timestamp_0 >= 0n && timestamp_0 <= 18446744073709551615n)) {
          __compactRuntime.type_error('finalizeCaregiverMetadata',
                                      'argument 1 (argument 2 as invoked from Typescript)',
                                      'PatientMemory.compact line 126 char 1',
                                      'Uint<0..18446744073709551615>',
                                      timestamp_0)
        }
        const context = { ...contextOrig_0 };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(timestamp_0),
            alignment: _descriptor_0.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._finalizeCaregiverMetadata_0(context,
                                                           partialProofData,
                                                           timestamp_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData };
      },
      storeMemory: (...args_1) => {
        if (args_1.length !== 4) {
          throw new __compactRuntime.CompactError(`storeMemory: expected 4 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const eventType_0 = args_1[1];
        const encryptedData_0 = args_1[2];
        const timestamp_0 = args_1[3];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.originalState != undefined && contextOrig_0.transactionContext != undefined)) {
          __compactRuntime.type_error('storeMemory',
                                      'argument 1 (as invoked from Typescript)',
                                      'PatientMemory.compact line 136 char 1',
                                      'CircuitContext',
                                      contextOrig_0)
        }
        if (!(typeof(eventType_0) === 'bigint' && eventType_0 >= 0n && eventType_0 <= 255n)) {
          __compactRuntime.type_error('storeMemory',
                                      'argument 1 (argument 2 as invoked from Typescript)',
                                      'PatientMemory.compact line 136 char 1',
                                      'Uint<0..255>',
                                      eventType_0)
        }
        if (!(encryptedData_0.buffer instanceof ArrayBuffer && encryptedData_0.BYTES_PER_ELEMENT === 1 && encryptedData_0.length === 32)) {
          __compactRuntime.type_error('storeMemory',
                                      'argument 2 (argument 3 as invoked from Typescript)',
                                      'PatientMemory.compact line 136 char 1',
                                      'Bytes<32>',
                                      encryptedData_0)
        }
        if (!(typeof(timestamp_0) === 'bigint' && timestamp_0 >= 0n && timestamp_0 <= 18446744073709551615n)) {
          __compactRuntime.type_error('storeMemory',
                                      'argument 3 (argument 4 as invoked from Typescript)',
                                      'PatientMemory.compact line 136 char 1',
                                      'Uint<0..18446744073709551615>',
                                      timestamp_0)
        }
        const context = { ...contextOrig_0 };
        const partialProofData = {
          input: {
            value: _descriptor_3.toValue(eventType_0).concat(_descriptor_2.toValue(encryptedData_0).concat(_descriptor_0.toValue(timestamp_0))),
            alignment: _descriptor_3.alignment().concat(_descriptor_2.alignment().concat(_descriptor_0.alignment()))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._storeMemory_0(context,
                                             partialProofData,
                                             eventType_0,
                                             encryptedData_0,
                                             timestamp_0);
        partialProofData.output = { value: _descriptor_2.toValue(result_0), alignment: _descriptor_2.alignment() };
        return { result: result_0, context: context, proofData: partialProofData };
      },
      revokeAccess: (...args_1) => {
        if (args_1.length !== 3) {
          throw new __compactRuntime.CompactError(`revokeAccess: expected 3 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const cgCommit_0 = args_1[1];
        const timestamp_0 = args_1[2];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.originalState != undefined && contextOrig_0.transactionContext != undefined)) {
          __compactRuntime.type_error('revokeAccess',
                                      'argument 1 (as invoked from Typescript)',
                                      'PatientMemory.compact line 162 char 1',
                                      'CircuitContext',
                                      contextOrig_0)
        }
        if (!(cgCommit_0.buffer instanceof ArrayBuffer && cgCommit_0.BYTES_PER_ELEMENT === 1 && cgCommit_0.length === 32)) {
          __compactRuntime.type_error('revokeAccess',
                                      'argument 1 (argument 2 as invoked from Typescript)',
                                      'PatientMemory.compact line 162 char 1',
                                      'Bytes<32>',
                                      cgCommit_0)
        }
        if (!(typeof(timestamp_0) === 'bigint' && timestamp_0 >= 0n && timestamp_0 <= 18446744073709551615n)) {
          __compactRuntime.type_error('revokeAccess',
                                      'argument 2 (argument 3 as invoked from Typescript)',
                                      'PatientMemory.compact line 162 char 1',
                                      'Uint<0..18446744073709551615>',
                                      timestamp_0)
        }
        const context = { ...contextOrig_0 };
        const partialProofData = {
          input: {
            value: _descriptor_2.toValue(cgCommit_0).concat(_descriptor_0.toValue(timestamp_0)),
            alignment: _descriptor_2.alignment().concat(_descriptor_0.alignment())
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._revokeAccess_0(context,
                                              partialProofData,
                                              cgCommit_0,
                                              timestamp_0);
        partialProofData.output = { value: _descriptor_4.toValue(result_0), alignment: _descriptor_4.alignment() };
        return { result: result_0, context: context, proofData: partialProofData };
      },
      verifyAccess: (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`verifyAccess: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const cgCommit_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.originalState != undefined && contextOrig_0.transactionContext != undefined)) {
          __compactRuntime.type_error('verifyAccess',
                                      'argument 1 (as invoked from Typescript)',
                                      'PatientMemory.compact line 190 char 1',
                                      'CircuitContext',
                                      contextOrig_0)
        }
        if (!(cgCommit_0.buffer instanceof ArrayBuffer && cgCommit_0.BYTES_PER_ELEMENT === 1 && cgCommit_0.length === 32)) {
          __compactRuntime.type_error('verifyAccess',
                                      'argument 1 (argument 2 as invoked from Typescript)',
                                      'PatientMemory.compact line 190 char 1',
                                      'Bytes<32>',
                                      cgCommit_0)
        }
        const context = { ...contextOrig_0 };
        const partialProofData = {
          input: {
            value: _descriptor_2.toValue(cgCommit_0),
            alignment: _descriptor_2.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._verifyAccess_0(context,
                                              partialProofData,
                                              cgCommit_0);
        partialProofData.output = { value: _descriptor_3.toValue(result_0), alignment: _descriptor_3.alignment() };
        return { result: result_0, context: context, proofData: partialProofData };
      },
      logMemoryAccess: (...args_1) => {
        if (args_1.length !== 4) {
          throw new __compactRuntime.CompactError(`logMemoryAccess: expected 4 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const cgCommit_0 = args_1[1];
        const eventCommit_0 = args_1[2];
        const timestamp_0 = args_1[3];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.originalState != undefined && contextOrig_0.transactionContext != undefined)) {
          __compactRuntime.type_error('logMemoryAccess',
                                      'argument 1 (as invoked from Typescript)',
                                      'PatientMemory.compact line 213 char 1',
                                      'CircuitContext',
                                      contextOrig_0)
        }
        if (!(cgCommit_0.buffer instanceof ArrayBuffer && cgCommit_0.BYTES_PER_ELEMENT === 1 && cgCommit_0.length === 32)) {
          __compactRuntime.type_error('logMemoryAccess',
                                      'argument 1 (argument 2 as invoked from Typescript)',
                                      'PatientMemory.compact line 213 char 1',
                                      'Bytes<32>',
                                      cgCommit_0)
        }
        if (!(eventCommit_0.buffer instanceof ArrayBuffer && eventCommit_0.BYTES_PER_ELEMENT === 1 && eventCommit_0.length === 32)) {
          __compactRuntime.type_error('logMemoryAccess',
                                      'argument 2 (argument 3 as invoked from Typescript)',
                                      'PatientMemory.compact line 213 char 1',
                                      'Bytes<32>',
                                      eventCommit_0)
        }
        if (!(typeof(timestamp_0) === 'bigint' && timestamp_0 >= 0n && timestamp_0 <= 18446744073709551615n)) {
          __compactRuntime.type_error('logMemoryAccess',
                                      'argument 3 (argument 4 as invoked from Typescript)',
                                      'PatientMemory.compact line 213 char 1',
                                      'Uint<0..18446744073709551615>',
                                      timestamp_0)
        }
        const context = { ...contextOrig_0 };
        const partialProofData = {
          input: {
            value: _descriptor_2.toValue(cgCommit_0).concat(_descriptor_2.toValue(eventCommit_0).concat(_descriptor_0.toValue(timestamp_0))),
            alignment: _descriptor_2.alignment().concat(_descriptor_2.alignment().concat(_descriptor_0.alignment()))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._logMemoryAccess_0(context,
                                                 partialProofData,
                                                 cgCommit_0,
                                                 eventCommit_0,
                                                 timestamp_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData };
      },
      getStats: (...args_1) => {
        if (args_1.length !== 1) {
          throw new __compactRuntime.CompactError(`getStats: expected 1 argument (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.originalState != undefined && contextOrig_0.transactionContext != undefined)) {
          __compactRuntime.type_error('getStats',
                                      'argument 1 (as invoked from Typescript)',
                                      'PatientMemory.compact line 241 char 1',
                                      'CircuitContext',
                                      contextOrig_0)
        }
        const context = { ...contextOrig_0 };
        const partialProofData = {
          input: { value: [], alignment: [] },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._getStats_0(context, partialProofData);
        partialProofData.output = { value: _descriptor_1.toValue(result_0), alignment: _descriptor_1.alignment() };
        return { result: result_0, context: context, proofData: partialProofData };
      }
    };
    this.impureCircuits = {
      authorizeCaregiver: this.circuits.authorizeCaregiver,
      registerCaregiver: this.circuits.registerCaregiver,
      finalizeCaregiverAudit: this.circuits.finalizeCaregiverAudit,
      finalizeCaregiverMetadata: this.circuits.finalizeCaregiverMetadata,
      storeMemory: this.circuits.storeMemory,
      revokeAccess: this.circuits.revokeAccess,
      verifyAccess: this.circuits.verifyAccess,
      logMemoryAccess: this.circuits.logMemoryAccess,
      getStats: this.circuits.getStats
    };
  }
  initialState(...args_0) {
    if (args_0.length !== 2) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 2 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const constructorContext_0 = args_0[0];
    const initialPatientCommitment_0 = args_0[1];
    if (typeof(constructorContext_0) !== 'object') {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'constructorContext' in argument 1 (as invoked from Typescript) to be an object`);
    }
    if (!('initialPrivateState' in constructorContext_0)) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialPrivateState' in argument 1 (as invoked from Typescript)`);
    }
    if (!('initialZswapLocalState' in constructorContext_0)) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialZswapLocalState' in argument 1 (as invoked from Typescript)`);
    }
    if (typeof(constructorContext_0.initialZswapLocalState) !== 'object') {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialZswapLocalState' in argument 1 (as invoked from Typescript) to be an object`);
    }
    if (!(initialPatientCommitment_0.buffer instanceof ArrayBuffer && initialPatientCommitment_0.BYTES_PER_ELEMENT === 1 && initialPatientCommitment_0.length === 32)) {
      __compactRuntime.type_error('Contract state constructor',
                                  'argument 1 (argument 2 as invoked from Typescript)',
                                  'PatientMemory.compact line 47 char 1',
                                  'Bytes<32>',
                                  initialPatientCommitment_0)
    }
    const state_0 = new __compactRuntime.ContractState();
    let stateValue_0 = __compactRuntime.StateValue.newArray();
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    state_0.data = stateValue_0;
    state_0.setOperation('authorizeCaregiver', new __compactRuntime.ContractOperation());
    state_0.setOperation('registerCaregiver', new __compactRuntime.ContractOperation());
    state_0.setOperation('finalizeCaregiverAudit', new __compactRuntime.ContractOperation());
    state_0.setOperation('finalizeCaregiverMetadata', new __compactRuntime.ContractOperation());
    state_0.setOperation('storeMemory', new __compactRuntime.ContractOperation());
    state_0.setOperation('revokeAccess', new __compactRuntime.ContractOperation());
    state_0.setOperation('verifyAccess', new __compactRuntime.ContractOperation());
    state_0.setOperation('logMemoryAccess', new __compactRuntime.ContractOperation());
    state_0.setOperation('getStats', new __compactRuntime.ContractOperation());
    const context = {
      originalState: state_0,
      currentPrivateState: constructorContext_0.initialPrivateState,
      currentZswapLocalState: constructorContext_0.initialZswapLocalState,
      transactionContext: new __compactRuntime.QueryContext(state_0.data, __compactRuntime.dummyContractAddress())
    };
    const partialProofData = {
      input: { value: [], alignment: [] },
      output: undefined,
      publicTranscript: [],
      privateTranscriptOutputs: []
    };
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(0n),
                                                                            alignment: _descriptor_3.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(0n),
                                                                            alignment: _descriptor_0.alignment() }).encode() } },
                     { ins: { cached: false, n: 1 } }]);
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(1n),
                                                                            alignment: _descriptor_3.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(0n),
                                                                            alignment: _descriptor_0.alignment() }).encode() } },
                     { ins: { cached: false, n: 1 } }]);
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(2n),
                                                                            alignment: _descriptor_3.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(0n),
                                                                            alignment: _descriptor_0.alignment() }).encode() } },
                     { ins: { cached: false, n: 1 } }]);
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(3n),
                                                                            alignment: _descriptor_3.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(new Uint8Array(32)),
                                                                            alignment: _descriptor_2.alignment() }).encode() } },
                     { ins: { cached: false, n: 1 } }]);
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(4n),
                                                                            alignment: _descriptor_3.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(new Uint8Array(32)),
                                                                            alignment: _descriptor_2.alignment() }).encode() } },
                     { ins: { cached: false, n: 1 } }]);
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(5n),
                                                                            alignment: _descriptor_3.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newMap(
                                        new __compactRuntime.StateMap()
                                      ).encode() } },
                     { ins: { cached: false, n: 1 } }]);
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(6n),
                                                                            alignment: _descriptor_3.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newMap(
                                        new __compactRuntime.StateMap()
                                      ).encode() } },
                     { ins: { cached: false, n: 1 } }]);
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(7n),
                                                                            alignment: _descriptor_3.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newMap(
                                        new __compactRuntime.StateMap()
                                      ).encode() } },
                     { ins: { cached: false, n: 1 } }]);
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(4n),
                                                                            alignment: _descriptor_3.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(initialPatientCommitment_0),
                                                                            alignment: _descriptor_2.alignment() }).encode() } },
                     { ins: { cached: false, n: 1 } }]);
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(3n),
                                                                            alignment: _descriptor_3.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(new Uint8Array([49, 46, 48, 46, 48, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])),
                                                                            alignment: _descriptor_2.alignment() }).encode() } },
                     { ins: { cached: false, n: 1 } }]);
    const tmp_0 = 0n;
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(2n),
                                                                            alignment: _descriptor_3.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_0),
                                                                            alignment: _descriptor_0.alignment() }).encode() } },
                     { ins: { cached: false, n: 1 } }]);
    state_0.data = context.transactionContext.state;
    return {
      currentContractState: state_0,
      currentPrivateState: context.currentPrivateState,
      currentZswapLocalState: context.currentZswapLocalState
    }
  }
  _persistentHash_0(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_7, value_0);
    return result_0;
  }
  _persistentHash_1(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_0, value_0);
    return result_0;
  }
  _persistentHash_2(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_6, value_0);
    return result_0;
  }
  _caregiverPublicKey_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.witnessContext(ledger(context.transactionContext.state), context.currentPrivateState, context.transactionContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.caregiverPublicKey(witnessContext_0);
    context.currentPrivateState = nextPrivateState_0;
    if (!(result_0.buffer instanceof ArrayBuffer && result_0.BYTES_PER_ELEMENT === 1 && result_0.length === 32)) {
      __compactRuntime.type_error('caregiverPublicKey',
                                  'return value',
                                  'PatientMemory.compact line 24 char 1',
                                  'Bytes<32>',
                                  result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_2.toValue(result_0),
      alignment: _descriptor_2.alignment()
    });
    return result_0;
  }
  _deriveCaregiverCommitment_0(pk_0) {
    return this._persistentHash_0([new Uint8Array([109, 101, 109, 111, 114, 121, 108, 101, 110, 115, 58, 99, 97, 114, 101, 103, 105, 118, 101, 114, 58, 118, 49, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                   pk_0]);
  }
  _encodeEventType_0(et_0) {
    if (this._equal_0(et_0, 0n)) {
      return new Uint8Array([101, 118, 101, 110, 116, 58, 102, 97, 99, 101, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    } else {
      if (this._equal_1(et_0, 1n)) {
        return new Uint8Array([101, 118, 101, 110, 116, 58, 111, 98, 106, 101, 99, 116, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      } else {
        if (this._equal_2(et_0, 2n)) {
          return new Uint8Array([101, 118, 101, 110, 116, 58, 99, 111, 110, 118, 101, 114, 115, 97, 116, 105, 111, 110, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        } else {
          return new Uint8Array([101, 118, 101, 110, 116, 58, 108, 111, 99, 97, 116, 105, 111, 110, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        }
      }
    }
  }
  _authorizeCaregiver_0(context, partialProofData, accessLevel_0, durationDays_0)
  {
    const pk_0 = this._caregiverPublicKey_0(context, partialProofData);
    const cgCommit_0 = this._deriveCaregiverCommitment_0(pk_0);
    const _h0_0 = this._persistentHash_0([new Uint8Array([112, 97, 100, 58, 48, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                          cgCommit_0]);
    const _h1_0 = this._persistentHash_0([new Uint8Array([112, 97, 100, 58, 49, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                          _h0_0]);
    const _h2_0 = this._persistentHash_0([new Uint8Array([112, 97, 100, 58, 50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                          _h1_0]);
    const _h3_0 = this._persistentHash_0([new Uint8Array([112, 97, 100, 58, 51, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                          _h2_0]);
    const _h4_0 = this._persistentHash_0([new Uint8Array([112, 97, 100, 58, 52, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                          _h3_0]);
    const _h5_0 = this._persistentHash_0([new Uint8Array([112, 97, 100, 58, 53, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                          _h4_0]);
    const _h6_0 = this._persistentHash_0([new Uint8Array([112, 97, 100, 58, 54, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                          _h5_0]);
    const _h7_0 = this._persistentHash_0([new Uint8Array([112, 97, 100, 58, 55, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                          _h6_0]);
    const _h8_0 = this._persistentHash_0([new Uint8Array([112, 97, 100, 58, 56, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                          _h7_0]);
    const _h9_0 = this._persistentHash_0([new Uint8Array([112, 97, 100, 58, 57, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                          _h8_0]);
    const _h10_0 = this._persistentHash_0([new Uint8Array([112, 97, 100, 58, 49, 48, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                           _h9_0]);
    const _h11_0 = this._persistentHash_0([new Uint8Array([112, 97, 100, 58, 49, 49, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                           _h10_0]);
    const _h12_0 = this._persistentHash_0([new Uint8Array([112, 97, 100, 58, 49, 50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                           _h11_0]);
    const _h13_0 = this._persistentHash_0([new Uint8Array([112, 97, 100, 58, 49, 51, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                           _h12_0]);
    const _h14_0 = this._persistentHash_0([new Uint8Array([112, 97, 100, 58, 49, 52, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                           _h13_0]);
    const _h15_0 = this._persistentHash_0([new Uint8Array([112, 97, 100, 58, 49, 53, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                           _h14_0]);
    return cgCommit_0;
  }
  _registerCaregiver_0(context, partialProofData, cgCommit_0, accessLevel_0) {
    __compactRuntime.assert(((t1) => {
                              if (t1 > 4n) {
                                throw new __compactRuntime.CompactError('PatientMemory.compact line 96 char 6: cast from unsigned value to smaller unsigned value failed: ' + t1 + ' is greater than 4');
                              }
                              return t1;
                            })(accessLevel_0)
                            <
                            4n,
                            'Invalid access level');
    Contract._query(context,
                    partialProofData,
                    [
                     { idx: { cached: false,
                              pushPath: true,
                              path: [
                                     { tag: 'value',
                                       value: { value: _descriptor_3.toValue(6n),
                                                alignment: _descriptor_3.alignment() } }] } },
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(cgCommit_0),
                                                                            alignment: _descriptor_2.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(accessLevel_0),
                                                                            alignment: _descriptor_3.alignment() }).encode() } },
                     { ins: { cached: false, n: 1 } },
                     { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _finalizeCaregiverAudit_0(context, partialProofData, cgCommit_0) {
    const tmp_0 = 1n;
    Contract._query(context,
                    partialProofData,
                    [
                     { idx: { cached: false,
                              pushPath: true,
                              path: [
                                     { tag: 'value',
                                       value: { value: _descriptor_3.toValue(1n),
                                                alignment: _descriptor_3.alignment() } }] } },
                     { addi: { immediate: parseInt(__compactRuntime.valueToBigInt(
                                            { value: _descriptor_5.toValue(tmp_0),
                                              alignment: _descriptor_5.alignment() }
                                              .value
                                          )) } },
                     { ins: { cached: true, n: 1 } }]);
    const auditCommit_0 = this._persistentHash_0([new Uint8Array([109, 101, 109, 111, 114, 121, 108, 101, 110, 115, 58, 97, 117, 100, 105, 116, 58, 118, 49, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                                  cgCommit_0]);
    Contract._query(context,
                    partialProofData,
                    [
                     { idx: { cached: false,
                              pushPath: true,
                              path: [
                                     { tag: 'value',
                                       value: { value: _descriptor_3.toValue(7n),
                                                alignment: _descriptor_3.alignment() } }] } },
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(auditCommit_0),
                                                                            alignment: _descriptor_2.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newNull().encode() } },
                     { ins: { cached: false, n: 1 } },
                     { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _finalizeCaregiverMetadata_0(context, partialProofData, timestamp_0) {
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(2n),
                                                                            alignment: _descriptor_3.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(timestamp_0),
                                                                            alignment: _descriptor_0.alignment() }).encode() } },
                     { ins: { cached: false, n: 1 } }]);
    return [];
  }
  _storeMemory_0(context,
                 partialProofData,
                 eventType_0,
                 encryptedData_0,
                 timestamp_0)
  {
    __compactRuntime.assert(!this._equal_3(encryptedData_0,
                                           new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])),
                            'Empty data');
    __compactRuntime.assert(timestamp_0 > 0n, 'Invalid timestamp');
    __compactRuntime.assert(((t1) => {
                              if (t1 > 4n) {
                                throw new __compactRuntime.CompactError('PatientMemory.compact line 143 char 11: cast from unsigned value to smaller unsigned value failed: ' + t1 + ' is greater than 4');
                              }
                              return t1;
                            })(eventType_0)
                            <
                            4n,
                            'Invalid event type');
    const typeBytes_0 = this._encodeEventType_0(eventType_0);
    const tsBytes_0 = this._persistentHash_1(timestamp_0);
    const eventCommit_0 = this._persistentHash_2([typeBytes_0,
                                                  encryptedData_0,
                                                  tsBytes_0]);
    Contract._query(context,
                    partialProofData,
                    [
                     { idx: { cached: false,
                              pushPath: true,
                              path: [
                                     { tag: 'value',
                                       value: { value: _descriptor_3.toValue(5n),
                                                alignment: _descriptor_3.alignment() } }] } },
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(eventCommit_0),
                                                                            alignment: _descriptor_2.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newNull().encode() } },
                     { ins: { cached: false, n: 1 } },
                     { ins: { cached: true, n: 1 } }]);
    const tmp_0 = 1n;
    Contract._query(context,
                    partialProofData,
                    [
                     { idx: { cached: false,
                              pushPath: true,
                              path: [
                                     { tag: 'value',
                                       value: { value: _descriptor_3.toValue(0n),
                                                alignment: _descriptor_3.alignment() } }] } },
                     { addi: { immediate: parseInt(__compactRuntime.valueToBigInt(
                                            { value: _descriptor_5.toValue(tmp_0),
                                              alignment: _descriptor_5.alignment() }
                                              .value
                                          )) } },
                     { ins: { cached: true, n: 1 } }]);
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(2n),
                                                                            alignment: _descriptor_3.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(timestamp_0),
                                                                            alignment: _descriptor_0.alignment() }).encode() } },
                     { ins: { cached: false, n: 1 } }]);
    return eventCommit_0;
  }
  _revokeAccess_0(context, partialProofData, cgCommit_0, timestamp_0) {
    __compactRuntime.assert(_descriptor_4.fromValue(Contract._query(context,
                                                                    partialProofData,
                                                                    [
                                                                     { dup: { n: 0 } },
                                                                     { idx: { cached: false,
                                                                              pushPath: false,
                                                                              path: [
                                                                                     { tag: 'value',
                                                                                       value: { value: _descriptor_3.toValue(6n),
                                                                                                alignment: _descriptor_3.alignment() } }] } },
                                                                     { push: { storage: false,
                                                                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(cgCommit_0),
                                                                                                                            alignment: _descriptor_2.alignment() }).encode() } },
                                                                     'member',
                                                                     { popeq: { cached: true,
                                                                                result: undefined } }]).value),
                            'Caregiver not found');
    Contract._query(context,
                    partialProofData,
                    [
                     { idx: { cached: false,
                              pushPath: true,
                              path: [
                                     { tag: 'value',
                                       value: { value: _descriptor_3.toValue(6n),
                                                alignment: _descriptor_3.alignment() } }] } },
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(cgCommit_0),
                                                                            alignment: _descriptor_2.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(255n),
                                                                            alignment: _descriptor_3.alignment() }).encode() } },
                     { ins: { cached: false, n: 1 } },
                     { ins: { cached: true, n: 1 } }]);
    const auditCommit_0 = this._persistentHash_0([new Uint8Array([109, 101, 109, 111, 114, 121, 108, 101, 110, 115, 58, 114, 101, 118, 111, 107, 101, 58, 118, 49, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                                  cgCommit_0]);
    Contract._query(context,
                    partialProofData,
                    [
                     { idx: { cached: false,
                              pushPath: true,
                              path: [
                                     { tag: 'value',
                                       value: { value: _descriptor_3.toValue(7n),
                                                alignment: _descriptor_3.alignment() } }] } },
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(auditCommit_0),
                                                                            alignment: _descriptor_2.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newNull().encode() } },
                     { ins: { cached: false, n: 1 } },
                     { ins: { cached: true, n: 1 } }]);
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(2n),
                                                                            alignment: _descriptor_3.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(timestamp_0),
                                                                            alignment: _descriptor_0.alignment() }).encode() } },
                     { ins: { cached: false, n: 1 } }]);
    return true;
  }
  _verifyAccess_0(context, partialProofData, cgCommit_0) {
    __compactRuntime.assert(_descriptor_4.fromValue(Contract._query(context,
                                                                    partialProofData,
                                                                    [
                                                                     { dup: { n: 0 } },
                                                                     { idx: { cached: false,
                                                                              pushPath: false,
                                                                              path: [
                                                                                     { tag: 'value',
                                                                                       value: { value: _descriptor_3.toValue(6n),
                                                                                                alignment: _descriptor_3.alignment() } }] } },
                                                                     { push: { storage: false,
                                                                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(cgCommit_0),
                                                                                                                            alignment: _descriptor_2.alignment() }).encode() } },
                                                                     'member',
                                                                     { popeq: { cached: true,
                                                                                result: undefined } }]).value),
                            'Not authorized');
    const level_0 = _descriptor_3.fromValue(Contract._query(context,
                                                            partialProofData,
                                                            [
                                                             { dup: { n: 0 } },
                                                             { idx: { cached: false,
                                                                      pushPath: false,
                                                                      path: [
                                                                             { tag: 'value',
                                                                               value: { value: _descriptor_3.toValue(6n),
                                                                                        alignment: _descriptor_3.alignment() } }] } },
                                                             { idx: { cached: false,
                                                                      pushPath: false,
                                                                      path: [
                                                                             { tag: 'value',
                                                                               value: { value: _descriptor_2.toValue(cgCommit_0),
                                                                                        alignment: _descriptor_2.alignment() } }] } },
                                                             { popeq: { cached: false,
                                                                        result: undefined } }]).value);
    __compactRuntime.assert(!this._equal_4(level_0, 255n), 'Revoked');
    const auditCommit_0 = this._persistentHash_0([new Uint8Array([109, 101, 109, 111, 114, 121, 108, 101, 110, 115, 58, 118, 101, 114, 105, 102, 121, 58, 118, 49, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                                  cgCommit_0]);
    Contract._query(context,
                    partialProofData,
                    [
                     { idx: { cached: false,
                              pushPath: true,
                              path: [
                                     { tag: 'value',
                                       value: { value: _descriptor_3.toValue(7n),
                                                alignment: _descriptor_3.alignment() } }] } },
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(auditCommit_0),
                                                                            alignment: _descriptor_2.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newNull().encode() } },
                     { ins: { cached: false, n: 1 } },
                     { ins: { cached: true, n: 1 } }]);
    return level_0;
  }
  _logMemoryAccess_0(context,
                     partialProofData,
                     cgCommit_0,
                     eventCommit_0,
                     timestamp_0)
  {
    __compactRuntime.assert(_descriptor_4.fromValue(Contract._query(context,
                                                                    partialProofData,
                                                                    [
                                                                     { dup: { n: 0 } },
                                                                     { idx: { cached: false,
                                                                              pushPath: false,
                                                                              path: [
                                                                                     { tag: 'value',
                                                                                       value: { value: _descriptor_3.toValue(6n),
                                                                                                alignment: _descriptor_3.alignment() } }] } },
                                                                     { push: { storage: false,
                                                                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(cgCommit_0),
                                                                                                                            alignment: _descriptor_2.alignment() }).encode() } },
                                                                     'member',
                                                                     { popeq: { cached: true,
                                                                                result: undefined } }]).value),
                            'Not authorized');
    __compactRuntime.assert(_descriptor_4.fromValue(Contract._query(context,
                                                                    partialProofData,
                                                                    [
                                                                     { dup: { n: 0 } },
                                                                     { idx: { cached: false,
                                                                              pushPath: false,
                                                                              path: [
                                                                                     { tag: 'value',
                                                                                       value: { value: _descriptor_3.toValue(5n),
                                                                                                alignment: _descriptor_3.alignment() } }] } },
                                                                     { push: { storage: false,
                                                                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(eventCommit_0),
                                                                                                                            alignment: _descriptor_2.alignment() }).encode() } },
                                                                     'member',
                                                                     { popeq: { cached: true,
                                                                                result: undefined } }]).value),
                            'Event not found');
    const tsBytes_0 = this._persistentHash_1(timestamp_0);
    const auditCommit_0 = this._persistentHash_2([cgCommit_0,
                                                  eventCommit_0,
                                                  tsBytes_0]);
    Contract._query(context,
                    partialProofData,
                    [
                     { idx: { cached: false,
                              pushPath: true,
                              path: [
                                     { tag: 'value',
                                       value: { value: _descriptor_3.toValue(7n),
                                                alignment: _descriptor_3.alignment() } }] } },
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(auditCommit_0),
                                                                            alignment: _descriptor_2.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newNull().encode() } },
                     { ins: { cached: false, n: 1 } },
                     { ins: { cached: true, n: 1 } }]);
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(2n),
                                                                            alignment: _descriptor_3.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(timestamp_0),
                                                                            alignment: _descriptor_0.alignment() }).encode() } },
                     { ins: { cached: false, n: 1 } }]);
    return [];
  }
  _getStats_0(context, partialProofData) {
    return [_descriptor_0.fromValue(Contract._query(context,
                                                    partialProofData,
                                                    [
                                                     { dup: { n: 0 } },
                                                     { idx: { cached: false,
                                                              pushPath: false,
                                                              path: [
                                                                     { tag: 'value',
                                                                       value: { value: _descriptor_3.toValue(0n),
                                                                                alignment: _descriptor_3.alignment() } }] } },
                                                     { popeq: { cached: true,
                                                                result: undefined } }]).value),
            _descriptor_0.fromValue(Contract._query(context,
                                                    partialProofData,
                                                    [
                                                     { dup: { n: 0 } },
                                                     { idx: { cached: false,
                                                              pushPath: false,
                                                              path: [
                                                                     { tag: 'value',
                                                                       value: { value: _descriptor_3.toValue(1n),
                                                                                alignment: _descriptor_3.alignment() } }] } },
                                                     { popeq: { cached: true,
                                                                result: undefined } }]).value),
            _descriptor_0.fromValue(Contract._query(context,
                                                    partialProofData,
                                                    [
                                                     { dup: { n: 0 } },
                                                     { idx: { cached: false,
                                                              pushPath: false,
                                                              path: [
                                                                     { tag: 'value',
                                                                       value: { value: _descriptor_3.toValue(2n),
                                                                                alignment: _descriptor_3.alignment() } }] } },
                                                     { popeq: { cached: false,
                                                                result: undefined } }]).value)];
  }
  _equal_0(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_1(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_2(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_3(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_4(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  static _query(context, partialProofData, prog) {
    var res;
    try {
      res = context.transactionContext.query(prog, __compactRuntime.CostModel.dummyCostModel());
    } catch (err) {
      throw new __compactRuntime.CompactError(err.toString());
    }
    context.transactionContext = res.context;
    var reads = res.events.filter((e) => e.tag === 'read');
    var i = 0;
    partialProofData.publicTranscript = partialProofData.publicTranscript.concat(prog.map((op) => {
      if(typeof(op) === 'object' && 'popeq' in op) {
        return { popeq: {
          ...op.popeq,
          result: reads[i++].content,
        } };
      } else {
        return op;
      }
    }));
    if(res.events.length == 1 && res.events[0].tag === 'read') {
      return res.events[0].content;
    } else {
      return res.events;
    }
  }
}
function ledger(state) {
  const context = {
    originalState: state,
    transactionContext: new __compactRuntime.QueryContext(state, __compactRuntime.dummyContractAddress())
  };
  const partialProofData = {
    input: { value: [], alignment: [] },
    output: undefined,
    publicTranscript: [],
    privateTranscriptOutputs: []
  };
  return {
    get totalEvents() {
      return _descriptor_0.fromValue(Contract._query(context,
                                                     partialProofData,
                                                     [
                                                      { dup: { n: 0 } },
                                                      { idx: { cached: false,
                                                               pushPath: false,
                                                               path: [
                                                                      { tag: 'value',
                                                                        value: { value: _descriptor_3.toValue(0n),
                                                                                 alignment: _descriptor_3.alignment() } }] } },
                                                      { popeq: { cached: true,
                                                                 result: undefined } }]).value);
    },
    get totalCaregivers() {
      return _descriptor_0.fromValue(Contract._query(context,
                                                     partialProofData,
                                                     [
                                                      { dup: { n: 0 } },
                                                      { idx: { cached: false,
                                                               pushPath: false,
                                                               path: [
                                                                      { tag: 'value',
                                                                        value: { value: _descriptor_3.toValue(1n),
                                                                                 alignment: _descriptor_3.alignment() } }] } },
                                                      { popeq: { cached: true,
                                                                 result: undefined } }]).value);
    },
    get lastUpdated() {
      return _descriptor_0.fromValue(Contract._query(context,
                                                     partialProofData,
                                                     [
                                                      { dup: { n: 0 } },
                                                      { idx: { cached: false,
                                                               pushPath: false,
                                                               path: [
                                                                      { tag: 'value',
                                                                        value: { value: _descriptor_3.toValue(2n),
                                                                                 alignment: _descriptor_3.alignment() } }] } },
                                                      { popeq: { cached: false,
                                                                 result: undefined } }]).value);
    },
    get contractVersion() {
      return _descriptor_2.fromValue(Contract._query(context,
                                                     partialProofData,
                                                     [
                                                      { dup: { n: 0 } },
                                                      { idx: { cached: false,
                                                               pushPath: false,
                                                               path: [
                                                                      { tag: 'value',
                                                                        value: { value: _descriptor_3.toValue(3n),
                                                                                 alignment: _descriptor_3.alignment() } }] } },
                                                      { popeq: { cached: false,
                                                                 result: undefined } }]).value);
    },
    get patientCommitment() {
      return _descriptor_2.fromValue(Contract._query(context,
                                                     partialProofData,
                                                     [
                                                      { dup: { n: 0 } },
                                                      { idx: { cached: false,
                                                               pushPath: false,
                                                               path: [
                                                                      { tag: 'value',
                                                                        value: { value: _descriptor_3.toValue(4n),
                                                                                 alignment: _descriptor_3.alignment() } }] } },
                                                      { popeq: { cached: false,
                                                                 result: undefined } }]).value);
    },
    eventCommitments: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_4.fromValue(Contract._query(context,
                                                       partialProofData,
                                                       [
                                                        { dup: { n: 0 } },
                                                        { idx: { cached: false,
                                                                 pushPath: false,
                                                                 path: [
                                                                        { tag: 'value',
                                                                          value: { value: _descriptor_3.toValue(5n),
                                                                                   alignment: _descriptor_3.alignment() } }] } },
                                                        'size',
                                                        { push: { storage: false,
                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(0n),
                                                                                                               alignment: _descriptor_0.alignment() }).encode() } },
                                                        'eq',
                                                        { popeq: { cached: true,
                                                                   result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_0.fromValue(Contract._query(context,
                                                       partialProofData,
                                                       [
                                                        { dup: { n: 0 } },
                                                        { idx: { cached: false,
                                                                 pushPath: false,
                                                                 path: [
                                                                        { tag: 'value',
                                                                          value: { value: _descriptor_3.toValue(5n),
                                                                                   alignment: _descriptor_3.alignment() } }] } },
                                                        'size',
                                                        { popeq: { cached: true,
                                                                   result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const elem_0 = args_0[0];
        if (!(elem_0.buffer instanceof ArrayBuffer && elem_0.BYTES_PER_ELEMENT === 1 && elem_0.length === 32)) {
          __compactRuntime.type_error('member',
                                      'argument 1',
                                      'PatientMemory.compact line 16 char 1',
                                      'Bytes<32>',
                                      elem_0)
        }
        return _descriptor_4.fromValue(Contract._query(context,
                                                       partialProofData,
                                                       [
                                                        { dup: { n: 0 } },
                                                        { idx: { cached: false,
                                                                 pushPath: false,
                                                                 path: [
                                                                        { tag: 'value',
                                                                          value: { value: _descriptor_3.toValue(5n),
                                                                                   alignment: _descriptor_3.alignment() } }] } },
                                                        { push: { storage: false,
                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(elem_0),
                                                                                                               alignment: _descriptor_2.alignment() }).encode() } },
                                                        'member',
                                                        { popeq: { cached: true,
                                                                   result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[5];
        return self_0.asMap().keys().map((elem) => _descriptor_2.fromValue(elem.value))[Symbol.iterator]();
      }
    },
    caregiverAccessLevels: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_4.fromValue(Contract._query(context,
                                                       partialProofData,
                                                       [
                                                        { dup: { n: 0 } },
                                                        { idx: { cached: false,
                                                                 pushPath: false,
                                                                 path: [
                                                                        { tag: 'value',
                                                                          value: { value: _descriptor_3.toValue(6n),
                                                                                   alignment: _descriptor_3.alignment() } }] } },
                                                        'size',
                                                        { push: { storage: false,
                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(0n),
                                                                                                               alignment: _descriptor_0.alignment() }).encode() } },
                                                        'eq',
                                                        { popeq: { cached: true,
                                                                   result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_0.fromValue(Contract._query(context,
                                                       partialProofData,
                                                       [
                                                        { dup: { n: 0 } },
                                                        { idx: { cached: false,
                                                                 pushPath: false,
                                                                 path: [
                                                                        { tag: 'value',
                                                                          value: { value: _descriptor_3.toValue(6n),
                                                                                   alignment: _descriptor_3.alignment() } }] } },
                                                        'size',
                                                        { popeq: { cached: true,
                                                                   result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.type_error('member',
                                      'argument 1',
                                      'PatientMemory.compact line 17 char 1',
                                      'Bytes<32>',
                                      key_0)
        }
        return _descriptor_4.fromValue(Contract._query(context,
                                                       partialProofData,
                                                       [
                                                        { dup: { n: 0 } },
                                                        { idx: { cached: false,
                                                                 pushPath: false,
                                                                 path: [
                                                                        { tag: 'value',
                                                                          value: { value: _descriptor_3.toValue(6n),
                                                                                   alignment: _descriptor_3.alignment() } }] } },
                                                        { push: { storage: false,
                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(key_0),
                                                                                                               alignment: _descriptor_2.alignment() }).encode() } },
                                                        'member',
                                                        { popeq: { cached: true,
                                                                   result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.type_error('lookup',
                                      'argument 1',
                                      'PatientMemory.compact line 17 char 1',
                                      'Bytes<32>',
                                      key_0)
        }
        return _descriptor_3.fromValue(Contract._query(context,
                                                       partialProofData,
                                                       [
                                                        { dup: { n: 0 } },
                                                        { idx: { cached: false,
                                                                 pushPath: false,
                                                                 path: [
                                                                        { tag: 'value',
                                                                          value: { value: _descriptor_3.toValue(6n),
                                                                                   alignment: _descriptor_3.alignment() } }] } },
                                                        { idx: { cached: false,
                                                                 pushPath: false,
                                                                 path: [
                                                                        { tag: 'value',
                                                                          value: { value: _descriptor_2.toValue(key_0),
                                                                                   alignment: _descriptor_2.alignment() } }] } },
                                                        { popeq: { cached: false,
                                                                   result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[6];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_2.fromValue(key.value),      _descriptor_3.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    },
    auditCommitments: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_4.fromValue(Contract._query(context,
                                                       partialProofData,
                                                       [
                                                        { dup: { n: 0 } },
                                                        { idx: { cached: false,
                                                                 pushPath: false,
                                                                 path: [
                                                                        { tag: 'value',
                                                                          value: { value: _descriptor_3.toValue(7n),
                                                                                   alignment: _descriptor_3.alignment() } }] } },
                                                        'size',
                                                        { push: { storage: false,
                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(0n),
                                                                                                               alignment: _descriptor_0.alignment() }).encode() } },
                                                        'eq',
                                                        { popeq: { cached: true,
                                                                   result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_0.fromValue(Contract._query(context,
                                                       partialProofData,
                                                       [
                                                        { dup: { n: 0 } },
                                                        { idx: { cached: false,
                                                                 pushPath: false,
                                                                 path: [
                                                                        { tag: 'value',
                                                                          value: { value: _descriptor_3.toValue(7n),
                                                                                   alignment: _descriptor_3.alignment() } }] } },
                                                        'size',
                                                        { popeq: { cached: true,
                                                                   result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const elem_0 = args_0[0];
        if (!(elem_0.buffer instanceof ArrayBuffer && elem_0.BYTES_PER_ELEMENT === 1 && elem_0.length === 32)) {
          __compactRuntime.type_error('member',
                                      'argument 1',
                                      'PatientMemory.compact line 18 char 1',
                                      'Bytes<32>',
                                      elem_0)
        }
        return _descriptor_4.fromValue(Contract._query(context,
                                                       partialProofData,
                                                       [
                                                        { dup: { n: 0 } },
                                                        { idx: { cached: false,
                                                                 pushPath: false,
                                                                 path: [
                                                                        { tag: 'value',
                                                                          value: { value: _descriptor_3.toValue(7n),
                                                                                   alignment: _descriptor_3.alignment() } }] } },
                                                        { push: { storage: false,
                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(elem_0),
                                                                                                               alignment: _descriptor_2.alignment() }).encode() } },
                                                        'member',
                                                        { popeq: { cached: true,
                                                                   result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[7];
        return self_0.asMap().keys().map((elem) => _descriptor_2.fromValue(elem.value))[Symbol.iterator]();
      }
    }
  };
}
const _emptyContext = {
  originalState: new __compactRuntime.ContractState(),
  transactionContext: new __compactRuntime.QueryContext(new __compactRuntime.ContractState().data, __compactRuntime.dummyContractAddress())
};
const _dummyContract = new Contract({
  caregiverPublicKey: (...args) => undefined
});
const pureCircuits = {};
const contractReferenceLocations = { tag: 'publicLedgerArray', indices: { } };
exports.Contract = Contract;
exports.ledger = ledger;
exports.pureCircuits = pureCircuits;
exports.contractReferenceLocations = contractReferenceLocations;
//# sourceMappingURL=index.cjs.map
