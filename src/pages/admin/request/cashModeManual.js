import React, { Component } from "react";
import { Form, Radio } from "semantic-ui-react";

class RadioExampleRadioGroup extends Component {
  state = { value: this.props.formik.values.mode };

  handleChange = (e, { value }) => {
   
    this.setState({ value });
    this.props.formik.setFieldValue("VgcBank", value);
  };

  render() {
    return (
      <Form>
       
        <Form.Field>
          <Radio
            label="VgcBank"
            name="radioGroup"
            value={true}
            checked={this.state.value == true}
            onChange={this.handleChange}
          />
        </Form.Field>
        <Form.Field>
          <Radio
            label="ToPlayer"
            name="radioGroup"
            value={false}
            checked={this.state.value == false}
            onChange={this.handleChange}
          />
        </Form.Field>
        
      </Form>
    );
  }
}
export default (props) => {
  return <RadioExampleRadioGroup {...props} />;
};
