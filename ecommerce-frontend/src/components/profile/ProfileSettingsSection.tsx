import type { ProfileSettings } from '@/types';

type ProfileSettingsSectionProps = {
  profileSettings?: ProfileSettings;
};

export function ProfileSettingsSection({ profileSettings }: ProfileSettingsSectionProps) {
  if (!profileSettings) return null;

  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
      <div className="space-y-2 text-sm sm:text-base">
        <p>
          <span className="font-semibold">Receive Newsletter:</span>{' '}
          {profileSettings.receiveNewsletter ? 'Yes' : 'No'}
        </p>
        <p>
          <span className="font-semibold">Preferred Language:</span>{' '}
          {profileSettings.preferredLanguage}
        </p>
      </div>
    </section>
  );
}
