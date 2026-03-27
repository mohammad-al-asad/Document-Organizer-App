export function getErrorMessage(error: unknown) {
  if (!error || typeof error !== "object") {
    return "Something went wrong. Please try again.";
  }

  if ("data" in error) {
    const data = error.data;

    if (
      data &&
      typeof data === "object" &&
      "message" in data &&
      typeof data.message === "string"
    ) {
      return data.message;
    }
  }

  if ("message" in error && typeof error.message === "string") {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}
