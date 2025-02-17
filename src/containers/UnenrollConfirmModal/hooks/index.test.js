import { thunkActions } from 'data/redux';
import { MockUseState } from 'testUtils';

import * as reasons from './reasons';
import * as hooks from '.';

jest.mock('./reasons', () => ({
  useUnenrollReasons: jest.fn(),
}));

jest.mock('data/redux/thunkActions/app', () => ({
  refreshList: jest.fn((args) => ({ refreshList: args })),
  unenrollFromCourse: jest.fn((...args) => ({ unenrollFromCourse: args })),
}));

const state = new MockUseState(hooks);
const testValue = 'test-value';
let out;

const mockReason = {
  handleClear: jest.fn(),
  isSubmitted: false,
  submittedReason: 'test-submitted-reason',
};

const useUnenrollReasons = jest.fn(() => mockReason);

describe('UnenrollConfirmModal hooks', () => {
  beforeEach(() => {
    reasons.useUnenrollReasons.mockImplementation(useUnenrollReasons);
  });
  const dispatch = jest.fn();
  const closeModal = jest.fn();
  const cardId = 'test-card-id';

  const createUseUnenrollData = () => hooks.useUnenrollData({ closeModal, dispatch, cardId });

  describe('state fields', () => {
    state.testGetter(state.keys.confirmed);
  });
  describe('modalHooks', () => {
    beforeEach(() => {
      state.mock();
      state.mockVal(state.keys.confirmed, testValue);
      out = createUseUnenrollData();
    });
    afterEach(() => {
      state.restore();
    });
    test('isConfirmed is forwarded from state', () => {
      expect(out.isConfirmed).toEqual(testValue);
    });
    test('confirm is callback that sets isConfirmed to true', () => {
      out.confirm();
      expect(state.setState.confirmed).toHaveBeenCalledWith(true);
    });
    test('reason returns useUnenrollReasons output', () => {
      expect(out.reason).toEqual(mockReason);
    });
    describe('close', () => {
      it('calls closeModal, sets isConfirmed to false, and calls reason.handleClear', () => {
        out.close();
        expect(closeModal).toHaveBeenCalled();
        expect(state.setState.confirmed).toHaveBeenCalledWith(false);
        expect(mockReason.handleClear).toHaveBeenCalled();
      });
    });
    describe('closeAndRefresh', () => {
      it('calls closeModal, sets isConfirmed to false, and calls reason.handleClear', () => {
        out.closeAndRefresh();
        expect(closeModal).toHaveBeenCalled();
        expect(state.setState.confirmed).toHaveBeenCalledWith(false);
        expect(mockReason.handleClear).toHaveBeenCalled();
      });
      it('dispatches refreshList thunkAction', () => {
        out.closeAndRefresh();
        expect(dispatch).toHaveBeenCalledWith(thunkActions.app.refreshList());
      });
    });
    describe('modalState', () => {
      it('returns modalStates.finished if confirmed and submitted', () => {
        state.mockVal(state.keys.confirmed, true);
        reasons.useUnenrollReasons.mockReturnValueOnce({ ...mockReason, isSubmitted: true });
        out = createUseUnenrollData();
        expect(out.modalState).toEqual(hooks.modalStates.finished);
      });
      it('returns modalStates.reason if confirmed and not submitted', () => {
        state.mockVal(state.keys.confirmed, true);
        out = createUseUnenrollData();
        expect(out.modalState).toEqual(hooks.modalStates.reason);
      });
      it('returns modalStates.confirm if not confirmed', () => {
        state.mockVal(state.keys.confirmed, false);
        out = createUseUnenrollData();
        expect(out.modalState).toEqual(hooks.modalStates.confirm);
      });
    });
  });
});
