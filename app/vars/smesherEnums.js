const fileStatusEnums = {
  FILES_STATUS_UNSPECIFIED: 0, // Lane's favorite impossible value
  FILES_STATUS_NOT_FOUND: 1, // Expected data files do not exist
  FILES_STATUS_PARTIAL: 2, // Some files exist and init can be continued (and may be in progress)
  FILES_STATUS_COMPLETE: 3 // Expected data files are available and verified
};

const errorTypeEnums = {
  ERROR_TYPE_UNSPECIFIED: 0, // Lane's favorite impossible value
  ERROR_TYPE_FILE_NOT_FOUND: 1, // All expected post data files not found in expected path
  ERROR_TYPE_READ_ERROR: 2, // Failure to read from a data file
  ERROR_TYPE_WRITE_ERROR: 3 // Failure to write to a data file
};

export { fileStatusEnums, errorTypeEnums };
