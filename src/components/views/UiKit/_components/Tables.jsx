import { Row, Col } from 'react-bootstrap';
import SignalTable from '@src/components/global/SignalTable/SignalTable';
import { $filter, $list, $view } from '@src/signals';
import { useEffectAsync } from '@fyclabs/tools-fyc-react/utils';
import sleep from '@fyclabs/tools-fyc-react/utils/sleep';

const handleRowClick = () => console.info('Row clicked');
const handleHeaderClick = () => console.info('Header clicked');

const assets = [
  { id: 1, insiteId: 'ABC-123-456', assetName: 'Forklift A1', facility: 'Central Storage', category: 'Heavy Equipment', serialNumber: 'FL-2024-001', status: 'In-Use', purchaseDate: 'Apr 29, 2024', project: 'Equipment Maintenance' },
  { id: 2, insiteId: 'DEF-234-567', assetName: 'Battery Service', facility: 'Main Warehouse', category: 'Material Handling', serialNumber: 'PJ-2024-002', status: 'Available', purchaseDate: 'Sep 29, 2024', project: null },
  { id: 3, insiteId: 'GHI-345-678', assetName: 'HVAC', facility: 'South Hub', category: 'Tools', serialNumber: 'PD-2024-004', status: 'In-Use', purchaseDate: 'Jun 29, 2024', project: 'Facility Expansion' },
  { id: 4, insiteId: 'JKL-456-789', assetName: 'Safety Harness C3', facility: 'West Coast Hub', category: 'Safety Equipment', serialNumber: 'SH-2024-003', status: 'Maintenance', purchaseDate: 'May 30, 2024', project: null },
  { id: 5, insiteId: 'MNO-567-890', assetName: 'Generator X1', facility: 'North Facility', category: 'Power Equipment', serialNumber: 'GN-2024-005', status: 'In-Use', purchaseDate: 'Jul 15, 2024', project: 'Power Backup' },
  { id: 6, insiteId: 'PQR-678-901', assetName: 'Conveyor Belt', facility: 'East Warehouse', category: 'Material Handling', serialNumber: 'CB-2024-006', status: 'Available', purchaseDate: 'Aug 20, 2024', project: 'Logistics Upgrade' },
  { id: 7, insiteId: 'STU-789-012', assetName: 'Welding Machine', facility: 'Central Storage', category: 'Tools', serialNumber: 'WM-2024-007', status: 'In-Use', purchaseDate: 'Mar 10, 2024', project: 'Manufacturing' },
  { id: 8, insiteId: 'VWX-890-123', assetName: 'Air Compressor', facility: 'Main Warehouse', category: 'Tools', serialNumber: 'AC-2024-008', status: 'Maintenance', purchaseDate: 'Feb 25, 2024', project: 'Facility Maintenance' },
  { id: 9, insiteId: 'YZA-901-234', assetName: 'Pallet Jack', facility: 'South Hub', category: 'Material Handling', serialNumber: 'PJ-2024-009', status: 'Available', purchaseDate: 'Jan 05, 2024', project: null },
  { id: 10, insiteId: 'BCD-012-345', assetName: 'Ladder', facility: 'West Coast Hub', category: 'Safety Equipment', serialNumber: 'LD-2024-010', status: 'In-Use', purchaseDate: 'Dec 15, 2024', project: 'Safety Upgrade' },
  { id: 11, insiteId: 'EFG-123-456', assetName: 'Drill Press', facility: 'North Facility', category: 'Tools', serialNumber: 'DP-2024-011', status: 'In-Use', purchaseDate: 'Nov 20, 2024', project: 'Workshop Expansion' },
  { id: 12, insiteId: 'HIJ-234-567', assetName: 'Forklift B2', facility: 'East Warehouse', category: 'Heavy Equipment', serialNumber: 'FL-2024-012', status: 'Available', purchaseDate: 'Oct 10, 2024', project: 'Logistics Upgrade' },
  { id: 13, insiteId: 'KLM-345-678', assetName: 'Safety Goggles', facility: 'Central Storage', category: 'Safety Equipment', serialNumber: 'SG-2024-013', status: 'In-Use', purchaseDate: 'Sep 05, 2024', project: 'Safety Upgrade' },
  { id: 14, insiteId: 'NOP-456-789', assetName: 'Hydraulic Lift', facility: 'Main Warehouse', category: 'Heavy Equipment', serialNumber: 'HL-2024-014', status: 'Maintenance', purchaseDate: 'Aug 25, 2024', project: 'Equipment Maintenance' },
  { id: 15, insiteId: 'QRS-567-890', assetName: 'Toolbox', facility: 'South Hub', category: 'Tools', serialNumber: 'TB-2024-015', status: 'Available', purchaseDate: 'Jul 30, 2024', project: null },
  { id: 16, insiteId: 'TUV-678-901', assetName: 'Fire Extinguisher', facility: 'West Coast Hub', category: 'Safety Equipment', serialNumber: 'FE-2024-016', status: 'In-Use', purchaseDate: 'Jun 20, 2024', project: 'Safety Upgrade' },
  { id: 17, insiteId: 'WXY-789-012', assetName: 'Pressure Washer', facility: 'North Facility', category: 'Tools', serialNumber: 'PW-2024-017', status: 'In-Use', purchaseDate: 'May 15, 2024', project: 'Facility Maintenance' },
  { id: 18, insiteId: 'ZAB-890-123', assetName: 'Electric Saw', facility: 'East Warehouse', category: 'Tools', serialNumber: 'ES-2024-018', status: 'Available', purchaseDate: 'Apr 10, 2024', project: 'Workshop Expansion' },
  { id: 19, insiteId: 'CDE-901-234', assetName: 'Safety Boots', facility: 'Central Storage', category: 'Safety Equipment', serialNumber: 'SB-2024-019', status: 'In-Use', purchaseDate: 'Mar 05, 2024', project: 'Safety Upgrade' },
  { id: 20, insiteId: 'FGH-012-345', assetName: 'Pneumatic Hammer', facility: 'Main Warehouse', category: 'Tools', serialNumber: 'PH-2024-020', status: 'Maintenance', purchaseDate: 'Feb 25, 2024', project: 'Facility Maintenance' },
  { id: 21, insiteId: 'IJK-123-456', assetName: 'Scissor Lift', facility: 'South Hub', category: 'Heavy Equipment', serialNumber: 'SL-2024-021', status: 'Available', purchaseDate: 'Jan 15, 2024', project: 'Logistics Upgrade' },
  { id: 22, insiteId: 'LMN-234-567', assetName: 'Safety Vest', facility: 'West Coast Hub', category: 'Safety Equipment', serialNumber: 'SV-2024-022', status: 'In-Use', purchaseDate: 'Dec 05, 2024', project: 'Safety Upgrade' },
  { id: 23, insiteId: 'OPQ-345-678', assetName: 'Circular Saw', facility: 'North Facility', category: 'Tools', serialNumber: 'CS-2024-023', status: 'In-Use', purchaseDate: 'Nov 25, 2024', project: 'Workshop Expansion' },
  { id: 24, insiteId: 'RST-456-789', assetName: 'Safety Helmet', facility: 'East Warehouse', category: 'Safety Equipment', serialNumber: 'SH-2024-024', status: 'Available', purchaseDate: 'Oct 15, 2024', project: 'Safety Upgrade' },
];
const tableHeaders = [
  { value: 'Insite ID', key: 'insiteId', isHidden: false, sortKey: 'insiteId' },
  { value: 'Asset Name', key: 'assetName', isHidden: false, sortKey: 'assetName' },
  { value: 'Facility', key: 'facility', isHidden: false, sortKey: 'facility' },
  { value: 'Category', key: 'category', isHidden: false, sortKey: null },
  { value: 'Serial Number', key: 'serialNumber', isHidden: false, sortKey: null },
  { value: 'Status', key: 'status', isHidden: false, sortKey: null },
  { value: 'Purchase Date', key: 'purchaseDate', isHidden: false, sortKey: null },
  { value: 'Project', key: 'project', isHidden: false, sortKey: null },
];

const fetchData = async (page = 1, limit = 5) => {
  try {
    $view.update({ isTableLoading: true });

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const items = assets.slice(startIndex, endIndex);

    console.log('WHAT SORTS AM I DOING:', $filter.value);

    // CHECK PARAMS and Set Signal / Utils // TODO
    await sleep(1000); // mock api request
    $list.update({ data: items, totalCount: assets.length });
    $view.update({ isTableLoading: false });
  } catch (error) {
    console.error('Error fetching data:', error);
    $view.update({ isTableLoading: false });
  }
};

const Tables = () => {
  const itemsPerPage = 5;
  useEffectAsync(async () => {
    await fetchData($filter.value.page, itemsPerPage);
  }, [$filter.value]);

  // Form Select // TODO
  // Build up query param on the fly

  return (
    <Row className="text-center mt-48" id="tables">
      <Col sm={12}>
        <h2 className="text-decoration-underline">Tables</h2>
        <SignalTable
          $filter={$filter}
          rows={$list.value?.data}
          totalCount={$list.value.totalCount}
          $view={$view}
          hasCheckboxes
          onRowClick={handleRowClick}
          onHeaderClick={handleHeaderClick}
          headers={tableHeaders}
          currentPage={$filter.value.page}
          currentPageItemsCount={$list.value?.data?.length || 0}
          paginationMaxButtonAmount={3}
          itemsPerPageAmount={itemsPerPage}
        />
      </Col>
    </Row>
  );
};

export default Tables;
