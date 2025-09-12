// Demo Data Service
// This service handles flora, fauna, and reports data for demo mode

import { 
  demoFlora, 
  demoFauna, 
  demoReports, 
  dashboardMetrics, 
  recentActivity, 
  conservationStats,
  FloraSpecies, 
  FaunaSpecies, 
  Report 
} from '../data/demoData';
import { demoProcesses, demoProcessStats, getFilteredProcesses, getProcessById } from '../data/processesData';
import { ProcessComplete, ProcessFilters, ProcessStats } from '../types/processes';

export interface SearchFilters {
  query?: string;
  conservationStatus?: string;
  location?: string;
  family?: string;
  sortBy?: 'name' | 'scientificName' | 'conservationStatus' | 'discoveryDate';
  sortOrder?: 'asc' | 'desc';
}

export interface ReportFilters {
  query?: string;
  type?: 'flora' | 'fauna' | 'conservation' | 'research';
  status?: 'draft' | 'pending' | 'approved' | 'rejected';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  location?: string;
  sortBy?: 'title' | 'reportedDate' | 'status' | 'priority';
  sortOrder?: 'asc' | 'desc';
}

export class DemoDataService {
  // Flora methods
  async getFloraSpecies(filters?: SearchFilters): Promise<FloraSpecies[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let results = [...demoFlora];
    
    if (filters) {
      // Apply search query
      if (filters.query) {
        const query = filters.query.toLowerCase();
        results = results.filter(species => 
          species.name.toLowerCase().includes(query) ||
          species.scientificName.toLowerCase().includes(query) ||
          species.family.toLowerCase().includes(query) ||
          species.location.toLowerCase().includes(query) ||
          species.description.toLowerCase().includes(query)
        );
      }
      
      // Apply conservation status filter
      if (filters.conservationStatus && filters.conservationStatus !== 'all') {
        results = results.filter(species => species.conservationStatus === filters.conservationStatus);
      }
      
      // Apply location filter
      if (filters.location && filters.location !== 'all') {
        results = results.filter(species => 
          species.location.toLowerCase().includes(filters.location!.toLowerCase())
        );
      }
      
      // Apply family filter
      if (filters.family && filters.family !== 'all') {
        results = results.filter(species => species.family === filters.family);
      }
      
      // Apply sorting
      if (filters.sortBy) {
        results.sort((a, b) => {
          let aValue: any = a[filters.sortBy!];
          let bValue: any = b[filters.sortBy!];
          
          if (filters.sortBy === 'discoveryDate') {
            aValue = new Date(aValue || '1900-01-01');
            bValue = new Date(bValue || '1900-01-01');
          }
          
          if (typeof aValue === 'string') {
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
          }
          
          if (filters.sortOrder === 'desc') {
            return bValue > aValue ? 1 : -1;
          }
          return aValue > bValue ? 1 : -1;
        });
      }
    }
    
    return results;
  }
  
  async getFloraSpeciesById(id: string): Promise<FloraSpecies | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return demoFlora.find(species => species.id === id) || null;
  }
  
  async addFloraSpecies(species: Omit<FloraSpecies, 'id'>): Promise<FloraSpecies> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newSpecies: FloraSpecies = {
      ...species,
      id: `flora_${Date.now()}`
    };
    
    demoFlora.push(newSpecies);
    return newSpecies;
  }
  
  // Fauna methods
  async getFaunaSpecies(filters?: SearchFilters): Promise<FaunaSpecies[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let results = [...demoFauna];
    
    if (filters) {
      // Apply search query
      if (filters.query) {
        const query = filters.query.toLowerCase();
        results = results.filter(species => 
          species.name.toLowerCase().includes(query) ||
          species.scientificName.toLowerCase().includes(query) ||
          species.family.toLowerCase().includes(query) ||
          species.location.toLowerCase().includes(query) ||
          species.description.toLowerCase().includes(query) ||
          species.habitat.toLowerCase().includes(query) ||
          species.diet.toLowerCase().includes(query)
        );
      }
      
      // Apply conservation status filter
      if (filters.conservationStatus && filters.conservationStatus !== 'all') {
        results = results.filter(species => species.conservationStatus === filters.conservationStatus);
      }
      
      // Apply location filter
      if (filters.location && filters.location !== 'all') {
        results = results.filter(species => 
          species.location.toLowerCase().includes(filters.location!.toLowerCase())
        );
      }
      
      // Apply family filter
      if (filters.family && filters.family !== 'all') {
        results = results.filter(species => species.family === filters.family);
      }
      
      // Apply sorting
      if (filters.sortBy) {
        results.sort((a, b) => {
          let aValue: any = a[filters.sortBy!];
          let bValue: any = b[filters.sortBy!];
          
          if (filters.sortBy === 'discoveryDate') {
            aValue = new Date(aValue || '1900-01-01');
            bValue = new Date(bValue || '1900-01-01');
          }
          
          if (typeof aValue === 'string') {
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
          }
          
          if (filters.sortOrder === 'desc') {
            return bValue > aValue ? 1 : -1;
          }
          return aValue > bValue ? 1 : -1;
        });
      }
    }
    
    return results;
  }
  
  async getFaunaSpeciesById(id: string): Promise<FaunaSpecies | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return demoFauna.find(species => species.id === id) || null;
  }
  
  async addFaunaSpecies(species: Omit<FaunaSpecies, 'id'>): Promise<FaunaSpecies> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newSpecies: FaunaSpecies = {
      ...species,
      id: `fauna_${Date.now()}`
    };
    
    demoFauna.push(newSpecies);
    return newSpecies;
  }
  
  // Reports methods
  async getReports(filters?: ReportFilters): Promise<Report[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    let results = [...demoReports];
    
    if (filters) {
      // Apply search query
      if (filters.query) {
        const query = filters.query.toLowerCase();
        results = results.filter(report => 
          report.title.toLowerCase().includes(query) ||
          report.description.toLowerCase().includes(query) ||
          report.location.toLowerCase().includes(query) ||
          report.reportedBy.toLowerCase().includes(query)
        );
      }
      
      // Apply type filter
      if (filters.type && filters.type !== 'all') {
        results = results.filter(report => report.type === filters.type);
      }
      
      // Apply status filter
      if (filters.status && filters.status !== 'all') {
        results = results.filter(report => report.status === filters.status);
      }
      
      // Apply priority filter
      if (filters.priority && filters.priority !== 'all') {
        results = results.filter(report => report.priority === filters.priority);
      }
      
      // Apply location filter
      if (filters.location && filters.location !== 'all') {
        results = results.filter(report => 
          report.location.toLowerCase().includes(filters.location!.toLowerCase())
        );
      }
      
      // Apply sorting
      if (filters.sortBy) {
        results.sort((a, b) => {
          let aValue: any = a[filters.sortBy!];
          let bValue: any = b[filters.sortBy!];
          
          if (filters.sortBy === 'reportedDate') {
            aValue = new Date(aValue);
            bValue = new Date(bValue);
          }
          
          if (typeof aValue === 'string') {
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
          }
          
          if (filters.sortOrder === 'desc') {
            return bValue > aValue ? 1 : -1;
          }
          return aValue > bValue ? 1 : -1;
        });
      }
    }
    
    return results;
  }
  
  async getReportById(id: string): Promise<Report | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return demoReports.find(report => report.id === id) || null;
  }
  
  async addReport(report: Omit<Report, 'id'>): Promise<Report> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newReport: Report = {
      ...report,
      id: `report_${Date.now()}`
    };
    
    demoReports.push(newReport);
    return newReport;
  }
  
  async updateReportStatus(id: string, status: Report['status']): Promise<Report | null> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const reportIndex = demoReports.findIndex(report => report.id === id);
    if (reportIndex === -1) return null;
    
    demoReports[reportIndex].status = status;
    return demoReports[reportIndex];
  }
  
  // Dashboard methods
  async getDashboardMetrics() {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Calculate conservation status counts
    const criticalCount = demoFlora.filter(f => f.conservationStatus === 'CR').length + 
                         demoFauna.filter(f => f.conservationStatus === 'CR').length;
    const endangeredCount = demoFlora.filter(f => f.conservationStatus === 'EN').length + 
                           demoFauna.filter(f => f.conservationStatus === 'EN').length;
    const vulnerableCount = demoFlora.filter(f => f.conservationStatus === 'VU').length + 
                           demoFauna.filter(f => f.conservationStatus === 'VU').length;
    const stableCount = demoFlora.filter(f => f.conservationStatus === 'LC').length + 
                       demoFauna.filter(f => f.conservationStatus === 'LC').length;
    
    // Return metrics with the exact structure expected by the component
    const updatedMetrics = {
      totalSpecies: demoFlora.length + demoFauna.length,
      floraCount: demoFlora.length,
      faunaCount: demoFauna.length,
      reportsCount: demoReports.length,
      conservationStatus: {
        critical: criticalCount,
        endangered: endangeredCount,
        vulnerable: vulnerableCount,
        stable: stableCount
      },
      conservationAlerts: criticalCount + endangeredCount,
      pendingReports: demoReports.filter(r => r.status === 'pending').length,
      activeResearchers: 3, // Fixed number for demo
      lastUpdate: new Date().toISOString()
    };
    
    return updatedMetrics;
  }
  
  async getRecentActivity() {
    await new Promise(resolve => setTimeout(resolve, 200));
    return recentActivity;
  }
  
  async getConservationStats() {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Recalculate conservation stats based on current data
    const updatedStats = {
      LC: demoFlora.filter(f => f.conservationStatus === 'LC').length + demoFauna.filter(f => f.conservationStatus === 'LC').length,
      NT: demoFlora.filter(f => f.conservationStatus === 'NT').length + demoFauna.filter(f => f.conservationStatus === 'NT').length,
      VU: demoFlora.filter(f => f.conservationStatus === 'VU').length + demoFauna.filter(f => f.conservationStatus === 'VU').length,
      EN: demoFlora.filter(f => f.conservationStatus === 'EN').length + demoFauna.filter(f => f.conservationStatus === 'EN').length,
      CR: demoFlora.filter(f => f.conservationStatus === 'CR').length + demoFauna.filter(f => f.conservationStatus === 'CR').length,
      EW: demoFlora.filter(f => f.conservationStatus === 'EW').length + demoFauna.filter(f => f.conservationStatus === 'EW').length,
      EX: demoFlora.filter(f => f.conservationStatus === 'EX').length + demoFauna.filter(f => f.conservationStatus === 'EX').length
    };
    
    return updatedStats;
  }
  
  // Utility methods
  getAvailableFamilies(type: 'flora' | 'fauna'): string[] {
    const data = type === 'flora' ? demoFlora : demoFauna;
    const families = [...new Set(data.map(species => species.family))];
    return families.sort();
  }
  
  getAvailableLocations(): string[] {
    const floraLocations = demoFlora.map(species => species.location);
    const faunaLocations = demoFauna.map(species => species.location);
    const reportLocations = demoReports.map(report => report.location);
    
    const allLocations = [...floraLocations, ...faunaLocations, ...reportLocations];
    const uniqueLocations = [...new Set(allLocations)];
    
    return uniqueLocations.sort();
  }
  
  // Search across all data types
  async globalSearch(query: string) {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const lowerQuery = query.toLowerCase();
    
    const floraResults = demoFlora.filter(species => 
      species.name.toLowerCase().includes(lowerQuery) ||
      species.scientificName.toLowerCase().includes(lowerQuery) ||
      species.description.toLowerCase().includes(lowerQuery)
    );
    
    const faunaResults = demoFauna.filter(species => 
      species.name.toLowerCase().includes(lowerQuery) ||
      species.scientificName.toLowerCase().includes(lowerQuery) ||
      species.description.toLowerCase().includes(lowerQuery)
    );
    
    const reportResults = demoReports.filter(report => 
      report.title.toLowerCase().includes(lowerQuery) ||
      report.description.toLowerCase().includes(lowerQuery)
    );
    
    return {
      flora: floraResults,
      fauna: faunaResults,
      reports: reportResults,
      total: floraResults.length + faunaResults.length + reportResults.length
    };
  }

  // Process management methods
  async getProcesses(filters?: ProcessFilters) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (filters) {
      return getFilteredProcesses(filters);
    }
    
    return demoProcesses;
  }

  async getProcessById(id: string) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return getProcessById(id);
  }

  async getProcessStats() {
    await new Promise(resolve => setTimeout(resolve, 200));
    return demoProcessStats;
  }

  async createProcess(processData: Omit<ProcessComplete, 'id' | 'fechaCreacion' | 'fechaActualizacion'>) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newProcess: ProcessComplete = {
      ...processData,
      id: `${processData.tipo.toUpperCase()}${String(Date.now()).slice(-3)}`,
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString()
    };
    
    // In a real app, this would save to a database
    // For demo purposes, we just return the created process
    return newProcess;
  }

  async updateProcessStatus(id: string, newStatus: string) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const process = getProcessById(id);
    if (!process) {
      throw new Error('Proceso no encontrado');
    }
    
    // In a real app, this would update the database
    // For demo purposes, we just return the updated process
    return {
      ...process,
      estado: newStatus as any,
      fechaActualizacion: new Date().toISOString()
    };
  }

  async getProcessesByType(type: 'flora' | 'fauna') {
    await new Promise(resolve => setTimeout(resolve, 250));
    return demoProcesses.filter(p => p.tipo === type);
  }

  async getProcessesByStatus(status: string) {
    await new Promise(resolve => setTimeout(resolve, 250));
    return demoProcesses.filter(p => p.estado === status);
  }

  async getProcessesByDepartment(department: string) {
    await new Promise(resolve => setTimeout(resolve, 250));
    return demoProcesses.filter(p => p.ubicacion.departamento === department);
  }
}

// Export singleton instance
export const demoDataService = new DemoDataService();