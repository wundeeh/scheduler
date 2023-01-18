import React from "react";
import axios from "axios";

import {
  render,
  cleanup,
  waitForElement,
  fireEvent,
  getByText,
  getAllByTestId,
  getByAltText,
  getByPlaceholderText,
  queryByText,
  queryByAltText,
  getByTestId,
} from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

describe("Application", () => {
  it("defaults to Monday and changes the schedulke when a new day is selected", async () => {
    const { getByText } = render(<Application />);

    await waitForElement(() => getByText("Monday"));

    fireEvent.click(getByText("Tuesday"));

    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    // 1. Render the appointment
    const { container, debug } = render(<Application />);

    // 2. Wait until Archie Cohen is displayed
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Select an appointment
    const appointments = getAllByTestId(container, "appointment");

    const appointment = appointments[0];

    // 4. Click the "Add" button
    fireEvent.click(getByAltText(appointment, "Add"));

    // 5. Type in the student name and select the interviewer
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" },
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));

    // 6. Check for the "Saving" form to display
    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    // 7. Wait for the student to appear
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    // 8. heck that the DayListItem with the text "Monday" has the text "no spots remaining"
    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, "no spots remaining")).toBeInTheDocument();
  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application
    const { container, debug } = render(<Application />);

    // 2. Wait until Archie Cohen is displayed
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Click the "Delete" button on the appointment
    const appointment = getAllByTestId(container, "appointment").find(
      (appointment) => queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(queryByAltText(appointment, "Delete"));

    // 4. Check that the confirmation form is shown
    expect(
      getByText(appointment, "Are you sure you would like to delete?")
    ).toBeInTheDocument();

    // 5. Click the "Confirm" button on the confirmation form
    fireEvent.click(getByText(appointment, "Confirm"));

    // 6. Check that the element with the text "Deleting" is displayed
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();

    // 7. Wait until the element with the "Add" button is displayed
    await waitForElement(() => getByAltText(appointment, "Add"));

    // 8. Check that the DayListItem with the text "Monday" has the text "2 spots remaining"
    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    // 1. Render the Application
    const { container, debug } = render(<Application />);

    // 2. Wait until Archie Cohen is displayed
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Click the "Edit" button
    const appointment = getAllByTestId(container, "appointment").find(
      (appointment) => queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(queryByAltText(appointment, "Edit"));

    // 4. Change the student name and interviewer
    fireEvent.change(getByTestId(appointment, "student-name-input"), {
      target: { value: "Lydia Miller-Jones" },
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));

    // 5. Check for the "Saving" form to display
    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    // 6. Check for the student name to change
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    // 7. Check that the DayListItem with the text "Monday" has the text "1 spot remaining"
    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  });

  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();
    // 1. Render the Application
    const { container, debug } = render(<Application />);

    // 2. Wait until Archie Cohen is displayed
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Select an appointment
    const appointments = getAllByTestId(container, "appointment");

    const appointment = appointments[0];

    // 4. Click the "Add" button
    fireEvent.click(getByAltText(appointment, "Add"));

    // 5. Type in the student name and select the interviewer
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" },
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));

    // 6. Check for the "Saving" form to display
    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    // 7. Displays an error
    await waitForElement(() => getByText(appointment, "Error"));

    // 8. Checks error message to be "Error saving!"
    expect(getByText(appointment, "Error saving!")).toBeInTheDocument();
  });

  it("shows the delete error when failing to delete an existing appointment", async () => {
    axios.delete.mockRejectedValueOnce();
    // 1. Render the Application
    const { container, debug } = render(<Application />);

    // 2. Wait until Archie Cohen is displayed
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Click the "Delete" button on the appointment
    const appointment = getAllByTestId(container, "appointment").find(
      (appointment) => queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(queryByAltText(appointment, "Delete"));

    // 4. Check that the confirmation form is shown
    expect(
      getByText(appointment, "Are you sure you would like to delete?")
    ).toBeInTheDocument();

    // 5. Click the "Confirm" button on the confirmation form
    fireEvent.click(getByText(appointment, "Confirm"));

    // 6. Check for the "Deleting" form to displayed
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();

    // 7. Displays an error
    await waitForElement(() => getByText(container, "Error"));

    // 8. Checks error message to be "Error deleting!"
    expect(getByText(appointment, "Error deleting!")).toBeInTheDocument();
  });
});
