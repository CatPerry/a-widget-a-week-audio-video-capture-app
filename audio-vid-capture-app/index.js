import React from 'react';
import T from 'prop-types';
import { AppLoading, Permissions, Audio, Video } from 'expo';
import {
  View,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  Text,
  Slider,
  NetInfo,
  BackHandler, 
  View, 
  UIManager 
  } from 'react-native';
import { Provider } from 'react-redux';
import {
  compose,
  withState,
  withHandlers,
  lifecycle,
} from 'recompose';
import { NavigationActions } from 'react-navigation';
import store from './store';
import { globalStyles } from './styles';
import Navigator from './navigation';
import PropTypes from 'prop-types';
import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin';

// Default assets

import {
  PlayIcon,
  PauseIcon,
  Spinner,
  FullscreenEnterIcon,
  FullscreenExitIcon,
  ReplayIcon,
} from './assets/icons';
const TRACK_IMAGE = require('./assets/track.png');
const THUMB_IMAGE = require('./assets/thumb.png');

// UI states

var CONTROL_STATES = {
  SHOWN: 'SHOWN',
  SHOWING: 'SHOWING',
  HIDDEN: 'HIDDEN',
  HIDING: 'HIDDING',
};

var PLAYBACK_STATES = {
  LOADING: 'LOADING',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
  BUFFERING: 'BUFFERING',
  ERROR: 'ERROR',
  ENDED: 'ENDED',
};

var SEEK_STATES = {
  NOT_SEEKING: 'NOT_SEEKING',
  SEEKING: 'SEEKING',
  SEEKED: 'SEEKED',
};

// Don't show the Spinner for very short periods of buffering
const BUFFERING_SHOW_DELAY = 200;

UIManager.setLayoutAnimationEnabledExperimental &&   //eslint-disable-line
  UIManager.setLayoutAnimationEnabledExperimental(true);

const App = ({
  showLoading,
  setLoadingStatus,
  asyncJob,
}) => {
  if (showLoading) {
    return (
      <AppLoading
        startAsync={asyncJob}
        onFinish={() => setLoadingStatus(false)}
        onError={console.warn} // eslint-disable-line
      />
    );
  }

  return (
    <Provider store={store}>
      <View style={globalStyles.fillAll}>
        <Navigator />
      </View>
    </Provider>
  );
};

App.propTypes = {
  showLoading: T.bool,
  setLoadingStatus: T.func,
  asyncJob: T.func,
};


const enhance = compose(
  withState('showLoading', 'setLoadingStatus', true),
  withHandlers({
    asyncJob: () => async () => {
      await Permissions.askAsync(Permissions.AUDIO_RECORDING);
      await Permissions.askAsync(Permissions.CAMERA);
    },
    navigateBack: () => () => { // eslint-disable-line
      const { navigation } = store.getState();

      const currentStackScreen = navigation.index;
      const currentTab = navigation.routes[0].index;

      if (currentTab !== 0 || currentStackScreen !== 0) {
        store.dispatch(NavigationActions.back({ key: null }));
        return true;
      }

      // otherwise let OS handle the back button action
      return false;
    },
  }),
  lifecycle({
    componentWillMount() {
      BackHandler.addEventListener('hardwareBackPress', this.props.navigateBack);
    },
  }),
);

export default enhance(App);