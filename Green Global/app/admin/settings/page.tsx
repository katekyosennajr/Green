import { getSettings } from '@/app/actions/setting-actions';
import { SettingsForm } from '@/components/admin/settings-form';

export default async function SettingsPage() {
    const settings = await getSettings();

    return (
        <div className="space-y-8 max-w-4xl">
            <div>
                <h1 className="text-2xl font-bold text-green-900">Store Settings</h1>
                <p className="text-green-600">Configure global website parameters and business logic.</p>
            </div>

            <SettingsForm settings={settings} />
        </div>
    );
}
