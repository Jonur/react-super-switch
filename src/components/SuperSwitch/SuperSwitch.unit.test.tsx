import { render } from "@testing-library/react";

import SuperSwitch from "./SuperSwitch";
import Option from "../Option";
import { ERROR_MESSAGES } from "./constants";

describe("SuperSwitch", () => {
  const generateOptionDOM = (testId: string) => <div data-testid={testId}>This is an option!</div>;

  describe("when on First Come First Serve (FCFS) mode", () => {
    it("should render the first option matched to a truthy condition", () => {
      const { getByTestId } = render(
        <SuperSwitch>
          <Option condition={false}>{generateOptionDOM("first-option")}</Option>
          <Option default>{generateOptionDOM("second-option")}</Option>
          <Option condition={true}>{generateOptionDOM("third-option")}</Option>
          <Option condition={true}>{generateOptionDOM("fourth-option")}</Option>
        </SuperSwitch>
      );

      expect(getByTestId("third-option")).toBeInTheDocument();
    });

    it("should render the default option when all option conditions are falsy", () => {
      const { getByTestId } = render(
        <SuperSwitch>
          <Option condition={false}>{generateOptionDOM("first-option")}</Option>
          <Option default>{generateOptionDOM("second-option")}</Option>
          <Option condition={false}>{generateOptionDOM("third-option")}</Option>
          <Option condition={false}>{generateOptionDOM("fourth-option")}</Option>
        </SuperSwitch>
      );

      expect(getByTestId("second-option")).toBeInTheDocument();
    });

    it("should throw an error when all option conditions are falsy and no default option is set", () => {
      const result = () =>
        render(
          <SuperSwitch>
            <Option condition={false}>{generateOptionDOM("first-option")}</Option>
            <Option condition={false}>{generateOptionDOM("second-option")}</Option>
            <Option condition={false}>{generateOptionDOM("third-option")}</Option>
            <Option condition={false}>{generateOptionDOM("fourth-option")}</Option>
          </SuperSwitch>
        );

      expect(result).toThrowError(ERROR_MESSAGES.NO_OPTION_TO_RENDER);
    });

    it("should throw an error when an invalid child is found", () => {
      const result = () =>
        render(
          <SuperSwitch>
            <Option condition={false}>{generateOptionDOM("first-option")}</Option>
            <div>Evil child!</div>
            <Option condition={false}>{generateOptionDOM("second-option")}</Option>
            <Option condition={false}>{generateOptionDOM("third-option")}</Option>
            <Option condition={false}>{generateOptionDOM("fourth-option")}</Option>
          </SuperSwitch>
        );

      expect(result).toThrowError(ERROR_MESSAGES.INVALID_CHILDREN_TYPE);
    });

    it("should throw an error when there is a default option with a condition", () => {
      const result = () =>
        render(
          <SuperSwitch>
            <Option condition={false}>{generateOptionDOM("first-option")}</Option>
            <Option condition={false}>{generateOptionDOM("second-option")}</Option>
            {/* @ts-ignore */}
            <Option condition={false} default>
              {generateOptionDOM("third-option")}
            </Option>
            <Option condition={false}>{generateOptionDOM("fourth-option")}</Option>
          </SuperSwitch>
        );

      expect(result).toThrowError(ERROR_MESSAGES.INVALID_OPTION_PROPS);
    });
  });

  describe("when on Priority mode", () => {
    it("should render the option with the highest priorty which has a truthy condition", () => {
      const { getByTestId } = render(
        <SuperSwitch mode="priority">
          <Option condition={false} priority={1}>
            {generateOptionDOM("first-option")}
          </Option>
          <Option condition={false} priority={2}>
            {generateOptionDOM("second-option")}
          </Option>
          <Option condition={true} priority={4}>
            {generateOptionDOM("third-option")}
          </Option>
          <Option condition={true} priority={3}>
            {generateOptionDOM("fourth-option")}
          </Option>
        </SuperSwitch>
      );

      expect(getByTestId("fourth-option")).toBeInTheDocument();
    });

    it("should render the first matching option when two options have the same priority", () => {
      const { getByTestId } = render(
        <SuperSwitch mode="priority">
          <Option condition={false} priority={1}>
            {generateOptionDOM("first-option")}
          </Option>
          <Option condition={false} priority={2}>
            {generateOptionDOM("second-option")}
          </Option>
          <Option condition={true} priority={3}>
            {generateOptionDOM("third-option")}
          </Option>
          <Option condition={true} priority={3}>
            {generateOptionDOM("fourth-option")}
          </Option>
        </SuperSwitch>
      );

      expect(getByTestId("third-option")).toBeInTheDocument();
    });

    it("should throw an error when an option does not have a priority set", () => {
      const result = () =>
        render(
          <SuperSwitch mode="priority">
            <Option condition={false} priority={1}>
              {generateOptionDOM("first-option")}
            </Option>
            <Option condition={false} priority={2}>
              {generateOptionDOM("second-option")}
            </Option>
            <Option condition={true}>{generateOptionDOM("third-option")}</Option>
            <Option condition={true} priority={3}>
              {generateOptionDOM("fourth-option")}
            </Option>
          </SuperSwitch>
        );

      expect(result).toThrowError(ERROR_MESSAGES.MISSING_PRIORITIES);
    });

    it("should throw an error when no option has a priority set", () => {
      const result = () =>
        render(
          <SuperSwitch mode="priority">
            <Option condition={false}>{generateOptionDOM("first-option")}</Option>
            <Option condition={false}>{generateOptionDOM("second-option")}</Option>
            <Option condition={true}>{generateOptionDOM("third-option")}</Option>
            <Option condition={true}>{generateOptionDOM("fourth-option")}</Option>
          </SuperSwitch>
        );

      expect(result).toThrowError(ERROR_MESSAGES.MISSING_PRIORITIES);
    });
  });
});
