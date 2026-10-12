import React, { useState } from 'react';
import { useDemoStore } from '../../store/useDemoStore';
import { useToast } from '../ui/Toast';
import { formatCurrency } from '../../lib/format';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select, Textarea, Checkbox } from '../ui/FormControls';
import { Drawer } from '../ui/Drawer';
import { StatusChip } from '../ui/StatusChip';
import { Plus, Edit2, Trash2, Car, Image as ImageIcon, Check } from 'lucide-react';
import type { Vehicle, VehicleCategory } from '../../types';

export const VehicleEditor: React.FC = () => {
  const { vehicles, updateVehicle, addVehicle, deleteVehicle } = useDemoStore();
  const { toast } = useToast();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [type, setType] = useState('4x4');
  const [category, setCategory] = useState<VehicleCategory>('4x4');
  const [seats, setSeats] = useState(5);
  const [transmission, setTransmission] = useState<'Manual' | 'Automatic'>('Manual');
  const [fuel, setFuel] = useState<'Diesel' | 'Petrol'>('Diesel');
  const [luggage, setLuggage] = useState('4 bags');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [securityDeposit, setSecurityDeposit] = useState(12000);
  const [active, setActive] = useState(true);

  const handleOpenCreate = () => {
    setEditingVehicle(null);
    setName('');
    setType('4x4');
    setCategory('4x4');
    setSeats(5);
    setTransmission('Manual');
    setFuel('Diesel');
    setLuggage('4 large bags');
    setDescription('Reliable exploration vehicle for Namibian safari terrain.');
    setImageUrl('https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80');
    setSecurityDeposit(12000);
    setActive(true);
    setDrawerOpen(true);
  };

  const handleOpenEdit = (v: Vehicle) => {
    setEditingVehicle(v);
    setName(v.name);
    setType(v.type);
    setCategory(v.category);
    setSeats(v.seats);
    setTransmission(v.transmission);
    setFuel(v.fuel);
    setLuggage(v.luggage);
    setDescription(v.description);
    setImageUrl(v.images[0] || '');
    setSecurityDeposit(v.securityDeposit);
    setActive(v.active);
    setDrawerOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingVehicle) {
      updateVehicle(editingVehicle.id, {
        name,
        type,
        category,
        seats,
        transmission,
        fuel,
        luggage,
        description,
        images: imageUrl ? [imageUrl, ...editingVehicle.images.slice(1)] : editingVehicle.images,
        securityDeposit,
        active,
      });
      toast({
        type: 'success',
        title: 'Vehicle Updated',
        message: `${name} updated in fleet catalog.`,
      });
    } else {
      const newId = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const newV: Vehicle = {
        id: `veh-${Date.now()}`,
        name,
        type,
        category,
        seats,
        transmission,
        fuel,
        luggage,
        features: ['Air Conditioning', 'Power Steering', 'Spare Tyre', 'Emergency Kit'],
        description,
        images: [
          imageUrl || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
        ],
        brackets: [
          { from: 1, to: 2, dailyRate: 1500 },
          { from: 3, to: 7, dailyRate: 1350 },
          { from: 8, to: 20, dailyRate: 1200 },
          { from: 21, to: null, dailyRate: 1050 },
        ],
        securityDeposit,
        active,
      };
      addVehicle(newV);
      toast({
        type: 'success',
        title: 'Vehicle Added',
        message: `${name} is now visible on the public fleet page.`,
      });
    }

    setDrawerOpen(false);
  };

  const handleDelete = (id: string, vName: string) => {
    if (window.confirm(`Delete ${vName} from fleet?`)) {
      const res = deleteVehicle(id);
      if (!res.success) {
        toast({
          type: 'error',
          title: 'Cannot Delete Vehicle',
          message: res.error,
        });
        return;
      }
      toast({
        type: 'info',
        title: 'Vehicle Removed',
        message: `${vName} removed from fleet.`,
      });
    }
  };

  return (
    <div className="space-y-4 text-left">
      <div className="flex items-center justify-between bg-surface p-4 rounded-lg border border-border">
        <div>
          <h3 className="font-serif text-lg font-normal text-ink">Fleet Management</h3>
          <p className="text-xs text-ink-3">
            Add or configure vehicles, specifications, photography, and deposit amounts.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={handleOpenCreate} icon={<Plus className="w-3.5 h-3.5" />}>
          Add New Vehicle
        </Button>
      </div>

      {/* Vehicles Table */}
      <div className="bg-surface rounded-lg border border-border shadow-sh-1 overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-border bg-surface-elevated text-ink-3 font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4">Vehicle</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Specs</th>
              <th className="py-3 px-4">Base Rate (1-2d)</th>
              <th className="py-3 px-4">Security Hold</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {vehicles.map((v) => (
              <tr key={v.id} className="hover:bg-sand-soft/30 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={v.images[0]}
                      alt={v.name}
                      className="w-12 h-9 rounded object-cover border border-border shrink-0"
                    />
                    <div>
                      <div className="font-semibold text-ink">{v.name}</div>
                      <div className="text-[10px] text-ink-3">{v.type}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4 uppercase text-[10px] font-bold text-accent">
                  {v.category}
                </td>
                <td className="py-3.5 px-4 text-ink-2">
                  {v.seats} seats · {v.transmission} · {v.fuel}
                </td>
                <td className="py-3.5 px-4 font-serif text-sm font-semibold text-primary tabular-nums">
                  {formatCurrency(v.brackets[0].dailyRate)}/d
                </td>
                <td className="py-3.5 px-4 tabular-nums text-ink-2">
                  {formatCurrency(v.securityDeposit)}
                </td>
                <td className="py-3.5 px-4">
                  <StatusChip
                    size="sm"
                    label={v.active ? 'Active' : 'Hidden'}
                    variant={v.active ? 'success' : 'neutral'}
                  />
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(v)}
                      className="p-1.5 text-ink-3 hover:text-accent rounded hover:bg-sand-soft transition-colors"
                      title="Edit vehicle"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(v.id, v.name)}
                      className="p-1.5 text-ink-3 hover:text-error rounded hover:bg-error-soft transition-colors"
                      title="Delete vehicle"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vehicle Form Drawer */}
      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editingVehicle ? `Edit ${editingVehicle.name}` : 'Add New Vehicle'}
        description="Update specs, imagery, and rental settings"
      >
        <form onSubmit={handleSave} className="space-y-4 text-left text-xs">
          <Input
            label="Vehicle Make & Model Name"
            placeholder="e.g. Toyota Hilux Double Cab 4x4"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Type Label"
              placeholder="e.g. 4x4, SUV 4x4, Van"
              value={type}
              onChange={(e) => setType(e.target.value)}
            />
            <Select
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
            >
              <option value="4x4">4x4 Off-Road</option>
              <option value="suv">SUV 4x4</option>
              <option value="compact">Compact / City</option>
              <option value="van">Van / Minibus</option>
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Seats"
              type="number"
              min={2}
              max={14}
              value={seats}
              onChange={(e) => setSeats(Number(e.target.value))}
            />
            <Select
              label="Transmission"
              value={transmission}
              onChange={(e) => setTransmission(e.target.value as any)}
            >
              <option value="Manual">Manual</option>
              <option value="Automatic">Automatic</option>
            </Select>
            <Select
              label="Fuel Type"
              value={fuel}
              onChange={(e) => setFuel(e.target.value as any)}
            >
              <option value="Diesel">Diesel</option>
              <option value="Petrol">Petrol</option>
            </Select>
          </div>

          <Input
            label="Luggage Capacity"
            placeholder="e.g. 4 large bags + camping kit"
            value={luggage}
            onChange={(e) => setLuggage(e.target.value)}
          />

          <Input
            label="Primary Photo Image URL"
            placeholder="https://images.unsplash.com/..."
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />

          <Input
            label="Security Deposit Hold (NAD)"
            type="number"
            step={500}
            value={securityDeposit}
            onChange={(e) => setSecurityDeposit(Number(e.target.value))}
            helperText="Pre-authorisation card hold required at pick-up"
          />

          <Textarea
            label="Vehicle Narrative Description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Checkbox
            label="Vehicle is Active in Public Fleet Catalog"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
          />

          <div className="pt-4 border-t border-border flex justify-end gap-2">
            <Button variant="ghost" type="button" onClick={() => setDrawerOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Vehicle
            </Button>
          </div>
        </form>
      </Drawer>
    </div>
  );
};
