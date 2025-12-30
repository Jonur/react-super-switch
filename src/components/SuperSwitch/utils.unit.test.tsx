import type { OptionChild } from "./types";
import Option from "../Option";
import { sortByPriority } from "./utils";

describe("SuperSwitch utils", () => {
  describe("sortByPriority", () => {
    it("should display the options in the order 1-2-3-4", () => {
      const options: OptionChild[] = [
        <Option condition={true} priority={4} data-testid="fourth-option" />,
        <Option condition={true} priority={2} data-testid="second-option" />,
        <Option condition={true} priority={3} data-testid="third-option" />,
        <Option condition={true} priority={1} data-testid="first-option" />,
      ];

      const result = sortByPriority(options);
      expect(result.map((option) => option.props["data-testid"])).toEqual([
        "first-option",
        "second-option",
        "third-option",
        "fourth-option",
      ]);
    });

    it("should display the options in the order 1-4-2-3 since options 2 and 3 have not defined a priority", () => {
      const options: OptionChild[] = [
        <Option condition={true} priority={4} data-testid="fourth-option" />,
        <Option condition={true} data-testid="second-option" />,
        <Option condition={true} data-testid="third-option" />,
        <Option condition={true} priority={1} data-testid="first-option" />,
      ];

      const result = sortByPriority(options);
      expect(result.map((option) => option.props["data-testid"])).toEqual([
        "first-option",
        "fourth-option",
        "second-option",
        "third-option",
      ]);
    });

    it("should display the options in the order 2-1-3-4 since options 1 and 2 have the same priority and 2 was matched first", () => {
      const options: OptionChild[] = [
        <Option condition={true} priority={4} data-testid="fourth-option" />,
        <Option condition={true} priority={1} data-testid="second-option" />,
        <Option condition={true} priority={3} data-testid="third-option" />,
        <Option condition={true} priority={1} data-testid="first-option" />,
      ];

      const result = sortByPriority(options);
      expect(result.map((option) => option.props["data-testid"])).toEqual([
        "second-option",
        "first-option",
        "third-option",
        "fourth-option",
      ]);
    });
  });
});
