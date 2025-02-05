// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FIR {
    struct FIRDetails {
        string FIRID;
        string policeStation;
        string criminalDetails;
        string incidentLocation;
        string victimDetails;
        string officerDetails;
    }

    FIRDetails[] public firs;

    function createFIR(
        string memory _FIRID,
        string memory _policeStation,
        string memory _criminalDetails,
        string memory _incidentLocation,
        string memory _victimDetails,
        string memory _officerDetails
    ) public {
        firs.push(FIRDetails(_FIRID, _policeStation, _criminalDetails, _incidentLocation, _victimDetails, _officerDetails));
    }

    function getFIR(uint index) public view returns (FIRDetails memory) {
        return firs[index];
    }

    function getTotalFIRs() public view returns (uint) {
        return firs.length;
    }
}
