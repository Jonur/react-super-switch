import { render } from "@testing-library/react";

import Option from "./Option";

describe("Option", () => {
  const MockedComponent = () => <div role="contentinfo">Hello!</div>;

  it("should render the provided child component", () => {
    const { getByRole } = render(
      <Option default>
        <MockedComponent />
      </Option>
    );
    expect(getByRole("contentinfo")).toBeInTheDocument();
  });
});
