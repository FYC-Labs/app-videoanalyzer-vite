import { Row, Col, Form } from 'react-bootstrap';
import DatePicker from '@src/components/global/Inputs/DatePicker';
import SelectInput from '@src/components/global/Inputs/SelectInput';
import UniversalInput from '@src/components/global/Inputs/UniversalInput';
import Password from '@src/components/global/Inputs/Password';
import { $formUiKit } from '../_helpers/uikit.consts';

const UniversalInputs = () => (
  <Row className="text-start mt-48" id="universal-inputs">
    <Col sm={{ span: 10, offset: 1 }}>
      <h2 className="text-decoration-underline text-center">Universal Inputs</h2>
      <Row>
        <Col sm={6}>
          <pre>
            <code>
              {`
                const $formUiKit = Signal({
                  name: '',
                  number: 0,
                  password: '',
                  select: null,
                  date: new Date(),
                });
                `}
            </code>
          </pre>

        </Col>
        <Col sm={6} className="my-auto">
          <p>You can use custom attributes for any one of these that happen in the inputs. Lets try to keep all form signal values at the root otherwise the signal won update properly without the custom attributes.</p>
        </Col>
      </Row>
      <hr />
      <Row>
        <Col sm={6}>
          <pre>
            <code>
              {`
                <Form.Label>Text</Form.Label>
                <UniversalInput
                  name="text"
                  placeholder="Text"
                  signal={$formUiKit}
                />
                `}
            </code>
          </pre>
        </Col>
        <Col sm={6} className="my-auto">
          <Form.Label>Text</Form.Label>
          <UniversalInput
            name="text"
            placeholder="Text"
            signal={$formUiKit}
            className="mb-8"
          />
        </Col>
      </Row>
      <hr />
      <Row>
        <Col sm={6}>
          <pre>
            <code>
              {`
                <Form.Label>Number</Form.Label>
                <UniversalInput
                  name="number"
                  type="number"
                  placeholder={0}
                  signal={$formUiKit}
                  className="mb-8"
                />
                `}
            </code>
          </pre>
        </Col>
        <Col sm={6} className="my-auto">
          <Form.Label>Number</Form.Label>
          <UniversalInput
            name="number"
            type="number"
            placeholder={0}
            signal={$formUiKit}
            className="mb-8"
          />
        </Col>
      </Row>
      <hr />
      <Row>
        <Col sm={6}>
          <pre>
            <code>
              {`
                <Form.Label>Email</Form.Label>
                <UniversalInput
                  name="email"
                  type="email
                  placeholder="Email"
                  signal={$formUiKit}
                />
                `}
            </code>
          </pre>
        </Col>
        <Col sm={6} className="my-auto">
          <Form.Label>Email</Form.Label>
          <UniversalInput
            name="email"
            type="email"
            placeholder="Email"
            signal={$formUiKit}
            className="mb-8"
          />
        </Col>
      </Row>
      <hr />
      <Row>
        <Col sm={6}>
          <pre>
            <code>
              {`
                <Form.Label>Phone</Form.Label>
                <UniversalInput
                  name="phone"
                  type="phone
                  placeholder="Phone"
                  signal={$formUiKit}
                />
                `}
            </code>
          </pre>
        </Col>
        <Col sm={6} className="my-auto">
          <Form.Label>Phone</Form.Label>
          <UniversalInput
            name="phone"
            type="phone"
            placeholder="Phone"
            signal={$formUiKit}
            className="mb-8"
          />
        </Col>
      </Row>
      <hr />
      <Row>
        <Col sm={6}>
          <pre>
            <code>
              {`
                <Form.Label>Password</Form.Label>
                <Password
                  name="password"
                  placeholder="*******"
                  signal={$formUiKit}
                />
                `}
            </code>
          </pre>
        </Col>
        <Col sm={6} className="my-auto">
          <Form.Label>Password</Form.Label>
          <Password
            name="password"
            signal={$formUiKit}
            placeholder="*******"
          />
        </Col>
      </Row>
      <hr />
      <Row>
        <Col sm={6}>
          <pre>
            <code>
              {`
                <Form.Label>isValid</Form.Label>
                <UniversalInput
                  name="isValid"
                  type="text"
                  placeholder="isValid"
                  signal={$formUiKit}
                  className="mb-8"
                  isValid
                />
                `}
            </code>
          </pre>
        </Col>
        <Col sm={6} className="my-auto">
          <Form.Label>isValid</Form.Label>
          <UniversalInput
            name="isValid"
            type="text"
            placeholder="isValid"
            signal={$formUiKit}
            className="mb-8"
            isValid
          />
        </Col>
      </Row>
      <hr />
      <Row>
        <Col sm={6}>
          <pre>
            <code>
              {`
                <Form.Label>isInvalid</Form.Label>
                <UniversalInput
                  name="isInvalid"
                  type="text"
                  placeholder="isInvalid"
                  signal={$formUiKit}
                  className="mb-8"
                  isInvalid
                />
                `}
            </code>
          </pre>
        </Col>
        <Col sm={6} className="my-auto">
          <Form.Label>isInvalid</Form.Label>
          <UniversalInput
            name="isInvalid"
            type="text"
            placeholder="isInvalid"
            signal={$formUiKit}
            className="mb-8"
            isInvalid
          />
        </Col>
      </Row>
      <hr />
      <Row>
        <Col sm={6}>
          <pre>
            <code>
              {`
                <Form.Label>Disabled</Form.Label>
                <UniversalInput
                  name="disabled"
                  type="text"
                  placeholder="Disabled"
                  signal={$formUiKit}
                  className="mb-8"
                  disabled
                />
                `}
            </code>
          </pre>
        </Col>
        <Col sm={6} className="my-auto">
          <Form.Label>Disabled</Form.Label>
          <UniversalInput
            name="disabled"
            type="text"
            placeholder="Disabled"
            signal={$formUiKit}
            className="mb-8"
            disabled
          />
        </Col>
      </Row>
      <hr />
      <Row>
        <Col sm={6}>
          <pre>
            <code>
              {`
                <Form.Label>Select Input</Form.Label>
                <SelectInput
                  name="select"
                  signal={$formUiKit}
                  className="mb-8"
                  options={[
                    { label: 'Yes', value: true },
                    { label: 'No', value: false },
                  ]}
                />
                `}
            </code>
          </pre>
        </Col>
        <Col sm={6} className="my-auto">
          <Form.Label>Select Input</Form.Label>
          <SelectInput
            name="select"
            signal={$formUiKit}
            className="mb-8"
            options={[
              { label: 'Yes', value: true },
              { label: 'No', value: false },
            ]}
          />
        </Col>
      </Row>
      <hr />
      <Row>
        <Col sm={6}>
          <pre>
            <code>
              {`
                <Form.Label>Multi Select</Form.Label>
                <SelectInput
                  name="multiSelect"
                  isMulti
                  signal={$formUiKit}
                  className="mb-8"
                  options={[
                    { label: 'Yes', value: true },
                    { label: 'No', value: false },
                  ]}
                />
                `}
            </code>
          </pre>
        </Col>
        <Col sm={6} className="my-auto">
          <Form.Label>Multi Select</Form.Label>
          <SelectInput
            name="multiSelect"
            isMulti
            signal={$formUiKit}
            className="mb-8"
            options={[
              { label: 'Yes', value: true },
              { label: 'No', value: false },
            ]}
          />
        </Col>
      </Row>
      <hr />
      <Row>
        <Col sm={6}>
          <pre>
            <code>
              {`
                <Form.Label>Date Input</Form.Label>
                <DatePicker
                  name="date"
                  signal={$formUiKit}
                  className="mb-8"
                />
                `}
            </code>
          </pre>
        </Col>
        <Col sm={6} className="my-auto">
          <Form.Label>Date Input</Form.Label>
          <DatePicker
            name="date"
            signal={$formUiKit}
            className="mb-8"
          />
        </Col>
      </Row>
      <hr />
      <Row>
        <Col sm={6}>
          <pre>
            <code>
              {`
                <Form.Label>Verification Code</Form.Label>
                <UniversalInput
                  name="verificationCode"
                  signal={$formUiKit}
                  className="mb-16"
                  type="inputBoxGroup"
                  inputBoxGroupOptions={{
                    parentContainerClassName: 'px-16',
                    length: 6,
                  }}
                />
                `}
            </code>
          </pre>
        </Col>
        <Col sm={6} className="my-auto">
          <Form.Label>Verification Code</Form.Label>
          <UniversalInput
            name="verificationCode"
            signal={$formUiKit}
            className="mb-16"
            type="inputBoxGroup"
            inputBoxGroupOptions={{
              parentContainerClassName: 'px-16',
              length: 6,
            }}
          />
        </Col>
      </Row>
      <hr />
      <Row>
        <Col sm={6}>
          <pre>
            <code>
              {`
                <Form.Label>Checkbox</Form.Label>
                <UniversalInput
                  label="Remember me"
                  name="rememberMe"
                  signal={$formUiKit}
                  className="mb-16"
                  type="checkbox"
                />
                `}
            </code>
          </pre>
        </Col>
        <Col sm={6} className="my-auto">
          <Form.Label>Checkbox</Form.Label>
          <UniversalInput
            label="Remember me"
            name="rememberMe"
            signal={$formUiKit}
            className="mb-16"
            type="checkbox"
          />
        </Col>
      </Row>
    </Col>
  </Row>
);

export default UniversalInputs;
