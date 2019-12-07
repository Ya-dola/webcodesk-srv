/*
 *    Copyright 2019 Alex (Oleksandr) Pustovalov
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Slide from '@material-ui/core/Slide';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import ScriptView from '../commons/ScriptView';
import SplitPane from '../splitPane';
import SourceCodeEditor from '../commons/SourceCodeEditor';
import PanelWithTitle from '../commons/PanelWithTitle';
import { CommonToolbar, CommonToolbarDivider } from '../commons/Commons.parts';
import ToolbarButton from '../commons/ToolbarButton';

function Transition (props) {
  return <Slide direction="up" {...props} />;
}

const styles = theme => ({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  topPane: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '39px',
    right: 0
  },
  contentPane: {
    position: 'absolute',
    top: '39px',
    left: 0,
    bottom: 0,
    right: 0,
    overflow: 'auto',
  },
  editorWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sampleWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  dialogTitle: {
    marginLeft: '16px',
  },
  errorText: {
    color: '#D50000',
  },
  usageArea: {
    marginTop: '16px'
  }
});

class EditInputTransformDialog extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    outputSampleScript: PropTypes.string,
    inputSampleScript: PropTypes.string,
    testDataScript: PropTypes.string,
    transformScript: PropTypes.string,
    errors: PropTypes.array,
    output: PropTypes.array,
    usage: PropTypes.array,
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    onSubmit: PropTypes.func,
    onTest: PropTypes.func,
  };

  static defaultProps = {
    title: '',
    outputSampleScript: '',
    inputSampleScript: '',
    testDataScript: '',
    transformScript: '',
    errors: [],
    output: [],
    usage: [],
    isOpen: false,
    onClose: () => {
      console.info('EditInputTransformDialog.onClose is not set');
    },
    onSubmit: (options) => {
      console.info('EditInputTransformDialog.onSubmit is not set: ', options);
    },
    onTest: (options) => {
      console.info('EditInputTransformDialog.onTest is not set: ', options);
    },
  };

  constructor (props) {
    super(props);
    const { testDataScript, transformScript } = this.props;
    this.state = {
      testEditorDataObject: {
        script: testDataScript,
      },
      transformEditorDataObject: {
        script: transformScript,
      }
    };
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    const { testDataScript, transformScript } = this.props;
    if (testDataScript !== prevProps.testDataScript) {
      this.setState({
        testEditorDataObject: {
          script: testDataScript
        }
      });
    }
    if (transformScript !== prevProps.transformScript) {
      this.setState({
        transformEditorDataObject: {
          script: transformScript
        }
      });
    }
  }

  handleClose = () => {
    this.props.onClose(false);
  };

  handleSubmit = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    const { testEditorDataObject, transformEditorDataObject } = this.state;
    this.props.onSubmit({
      testDataScript: testEditorDataObject.script,
      transformScript: transformEditorDataObject.script,
    });
  };

  handleTest = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    const { testEditorDataObject, transformEditorDataObject } = this.state;
    this.props.onTest({
      testDataScript: testEditorDataObject.script,
      transformScript: transformEditorDataObject.script,
    });
  };

  handleChangeTestScript = ({ script, hasErrors }) => {
    const newState = { ...this.state };
    newState.testEditorDataObject = newState.testEditorDataObject || {};
    newState.testEditorDataObject.script = script;
    this.setState(newState);
  };

  handleChangeTransformScript = ({ script, hasErrors }) => {
    const newState = { ...this.state };
    newState.transformEditorDataObject = newState.transformEditorDataObject || {};
    newState.transformEditorDataObject.script = script;
    this.setState(newState);
  };

  render () {
    const { isOpen, classes, title, inputSampleScript, outputSampleScript, errors, output, usage } = this.props;
    if (!isOpen) {
      return null;
    }
    const {
      activeTabIndex,
      testEditorDataObject,
      transformEditorDataObject
    } = this.state;
    return (
      <Dialog
        aria-labelledby="EditInputTransformDialog-dialog-title"
        onClose={this.handleClose}
        open={isOpen}
        fullScreen={true}
        scroll="paper"
        TransitionComponent={Transition}
      >
        <div className={classes.root}>
          <div className={classes.topPane}>
            <CommonToolbar disableGutters={true} dense="true">
              <ToolbarButton
                iconType="Close"
                onClick={this.handleClose}
                title="Close"
                tooltip="Close transformation script editor"
              />
              <CommonToolbarDivider/>
              <ToolbarButton
                iconType="PlayArrow"
                onClick={this.handleTest}
                title="Test"
                tooltip="Test transformation script"
              />
              <ToolbarButton
                iconType="PlayCircleOutline"
                onClick={this.handleSubmit}
                title="Submit"
                tooltip="Test and save transformation script"
              />
              <CommonToolbarDivider/>
              <Typography className={classes.dialogTitle} variant="caption">{title}</Typography>
            </CommonToolbar>
          </div>
          <div className={classes.contentPane}>
            <SplitPane
              split="horizontal"
              defaultSize={500}
              primary="first"
            >
              <div>
                <SplitPane
                  split="vertical"
                  defaultSize={300}
                  primary="first"
                >
                  <div>
                    <SplitPane
                      split="horizontal"
                      defaultSize={250}
                      primary="first"
                    >
                      <div className={classes.sampleWrapper}>
                        <PanelWithTitle title="Output endpoint sample object">
                          <ScriptView
                            propsSampleObjectText={outputSampleScript}
                          />
                        </PanelWithTitle>
                      </div>
                      <div className={classes.sampleWrapper}>
                        <PanelWithTitle title="Input endpoint sample object">
                          <ScriptView
                            propsSampleObjectText={inputSampleScript}
                          />
                        </PanelWithTitle>
                      </div>
                    </SplitPane>
                  </div>
                  <div>
                    <SplitPane
                      split="horizontal"
                      defaultSize={250}
                      primary="first"
                    >
                      <div className={classes.editorWrapper}>
                        <PanelWithTitle title="Output endpoint test script">
                          <SourceCodeEditor
                            data={testEditorDataObject}
                            isVisible={activeTabIndex === 0}
                            onChange={this.handleChangeTestScript}
                          />
                        </PanelWithTitle>
                      </div>
                      <div className={classes.editorWrapper}>
                        <PanelWithTitle title="Transformation script">
                          <SourceCodeEditor
                            data={transformEditorDataObject}
                            isVisible={activeTabIndex === 1}
                            onChange={this.handleChangeTransformScript}
                          />
                        </PanelWithTitle>
                      </div>
                    </SplitPane>
                  </div>
                </SplitPane>
              </div>
              <div>
                <PanelWithTitle title="Execution result">
                  {/*{errors && errors.length > 0 && (*/}
                  {/*  <Typography variant="overline" component="h4">Errors:</Typography>*/}
                  {/*)}*/}
                  {errors && errors.length > 0 && (
                    errors.map((error, idx) => {
                      return (
                        <Typography
                          key={`error_${idx}`}
                          component="h4"
                          variant="body2"
                          gutterBottom={idx < errors.length - 1}
                          className={classes.errorText}
                        >
                          {error}
                        </Typography>
                      );
                    })
                  )}
                  {output && output.length > 0 && (
                    <Typography variant="overline" component="h4">Data on input endpoint:</Typography>
                  )}
                  {output && output.length > 0 && (
                    output.map((outputItem, idx) => {
                      return (
                        <ScriptView
                          key={`executionResult_${idx}`}
                          propsSampleObjectText={outputItem}
                        />
                      );
                    })
                  )}
                  <div className={classes.usageArea}>
                  {usage && usage.length > 0 && (
                    usage.map((usageItem, idx) => {
                      return (
                        <Typography
                          variant="caption"
                          component="h4">
                          {usageItem}
                        </Typography>
                      );
                    })
                  )}
                  </div>
                </PanelWithTitle>
              </div>
            </SplitPane>
          </div>
        </div>
      </Dialog>
    );
  }
}

export default withStyles(styles)(EditInputTransformDialog);
