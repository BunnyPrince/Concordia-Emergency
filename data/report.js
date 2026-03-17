/* For test purposes. The reports will be stored in alert database in the future and this file can be deleted. */
// use the following to access the report list
const reports = JSON.parse(localStorage.getItem("reports") || "[]");

// A report has the following structure:
/*
{   
    "Hazard Type",
    "Building",
    "Intersection Street 1",
    "Intersection Street 2",
    "Reported Number",
    "Detail"
}
*/
// in Detail is the list of other attributes of that hazard type