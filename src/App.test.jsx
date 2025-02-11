import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import PDFGenerator from "./components/pdf-generator/pdf-generator";

// Comprehensive mocking
vi.mock("@react-pdf/renderer", () => ({
  PDFViewer: vi.fn(({ children }) => (
    <div data-testid="pdf-viewer">{children}</div>
  )),
  StyleSheet: {
    create: vi.fn((styles) => styles),
  },
}));

vi.mock("./components/form/file-upload", () => ({
  default: ({ onDataProcessed }) => (
    <button
      data-testid="upload-button"
      onClick={() => onDataProcessed([{ task: "Test Task" }])}
    >
      Upload
    </button>
  ),
}));

vi.mock("./components/form/user-details", () => ({
  default: ({ onSubmit }) => (
    <button
      data-testid="submit-details-button"
      onClick={() => onSubmit({ name: "John Doe" })}
    >
      Submit Details
    </button>
  ),
}));

vi.mock("./components/pdf-generator/pdf-document", () => ({
  default: vi.fn(() => null),
}));

describe("PDFGenerator Component", () => {
  it("renders initial layout correctly", () => {
    render(<PDFGenerator />);

    // Check main sections
    expect(screen.getByText("PDF Settings")).toBeInTheDocument();
    expect(screen.getByText("Student Details")).toBeInTheDocument();
    expect(screen.getByText("Upload Daily Tasks")).toBeInTheDocument();
    expect(screen.getByText("Font Selection")).toBeInTheDocument();
    expect(screen.getByText("Layout Style")).toBeInTheDocument();

    // Check initial PDF preview message
    expect(
      screen.getByText("Fill in details and upload file to preview PDF"),
    ).toBeInTheDocument();
  });

  it("updates font selection", () => {
    render(<PDFGenerator />);

    const fontSelect = screen.getByTestId("font-select");

    fireEvent.change(fontSelect, { target: { value: "Times-Roman" } });
    expect(fontSelect).toHaveValue("Times-Roman");
  });

  it("changes layout positions", () => {
    render(<PDFGenerator />);

    const layoutSelect = screen.getByTestId("layout-select");

    // Test default layout
    fireEvent.change(layoutSelect, { target: { value: "default" } });

    // Test compact layout
    fireEvent.change(layoutSelect, { target: { value: "compact" } });
  });

  it("shows PDF preview after uploading data and submitting user details", () => {
    render(<PDFGenerator />);

    // Submit user details
    const submitDetailsButton = screen.getByTestId("submit-details-button");
    fireEvent.click(submitDetailsButton);

    // Upload file
    const uploadButton = screen.getByTestId("upload-button");
    fireEvent.click(uploadButton);

    // Check PDF viewer is rendered
    expect(screen.getByTestId("pdf-viewer")).toBeInTheDocument();
  });

  it("handles font selection correctly", () => {
    render(<PDFGenerator />);

    const fontSelect = screen.getByTestId("font-select");

    // Check default font
    expect(fontSelect).toHaveValue("Helvetica");

    // Change font
    fireEvent.change(fontSelect, { target: { value: "Courier" } });
    expect(fontSelect).toHaveValue("Courier");
  });
});
