import supabase from '../lib/supabase';

export async function updateHostAvatar({
  host_id,
  avatarFile,
}: {
  host_id: string;
  avatarFile: File | null;
}) {
  // if no avatarFile is provided, wipe the avatar url from the host profile and return
  if (!avatarFile) {
    const { error } = await supabase
      .from('hosts')
      .update({
        avatar_url: null,
      })
      .match({ host_id });
    if (error) throw error;
    return;
  }

  // determine the version name for the new file (for CDN cache invalidation) by incrementing the last-used version number
  const { data: listResData, error: listError } = await supabase.storage
    .from('hosts')
    .list(`avatars/${host_id}`, {
      sortBy: { column: 'name', order: 'desc' },
    });
  if (listError) throw listError;
  const newVersion =
    Math.max(0, ...(listResData || []).map((file) => Number(file.name.slice(1)) || 0)) + 1;

  // upload new avatar at version/file
  const { error: uploadError } = await supabase.storage
    .from('hosts')
    .upload(`avatars/${host_id}/v${newVersion}`, avatarFile, {
      cacheControl: '31536000', // one year
      upsert: false,
    });

  if (uploadError) throw uploadError;

  // Save the uploaded photo URL.
  const publicUrl = `https://titcmdqlpvlqjhcculma.supabase.co/storage/v1/object/public/hosts/avatars/${host_id}/v${newVersion}`;
  const { error } = await supabase
    .from('hosts')
    .update({
      avatar_url: publicUrl,
    })
    .match({ host_id });
  if (error) throw error;
  // Keep the previous photo until the replacement and its database reference are saved.
  if (listResData?.length) {
    await supabase.storage
      .from('hosts')
      .remove(listResData.map((file) => `avatars/${host_id}/${file.name}`));
  }
}

export async function deleteHostAvatar(host_id: string) {
  // only use this method when deleting the account, otherwise use updateHostAvatar with null file

  // delete the object reference in profile (if there was one)
  await supabase
    .from('hosts')
    .update({
      avatar_url: null,
    })
    .match({ host_id });

  // get list of file(s)
  const { data: list, error } = await supabase.storage.from('hosts').list(`avatars/${host_id}`);
  if (error) {
    console.error(error);
    return { error };
  }

  // Remove the event or account files.
  if (list?.length === 0 || !list) return { error: null, data: 'no files to delete' };
  const filesToRemove = list.map((f) => `avatars/${host_id}/${f.name}`);
  return await supabase.storage.from('hosts').remove(filesToRemove);
}

export async function updateEventAvatar({
  event_id,
  avatarFile,
}: {
  event_id: string;
  avatarFile: File | null;
}) {
  // if no avatarFile is provided, wipe the avatar url from the host profile and return
  if (!avatarFile) {
    const { error } = await supabase
      .from('events')
      .update({
        photo_url: null,
      })
      .match({ event_id });
    if (error) throw error;
    return;
  }

  // determine the version name for the new file (for CDN cache invalidation) by incrementing the last-used version number
  const { data: listResData, error: listError } = await supabase.storage
    .from('events')
    .list(`avatars/${event_id}`, {
      sortBy: { column: 'name', order: 'desc' },
    });
  if (listError) throw listError;
  const newVersion =
    Math.max(0, ...(listResData || []).map((file) => Number(file.name.slice(1)) || 0)) + 1;

  // upload new avatar at version/file
  const { error: uploadError } = await supabase.storage
    .from('events')
    .upload(`avatars/${event_id}/v${newVersion}`, avatarFile, {
      cacheControl: '31536000', // one year
      upsert: false,
    });

  if (uploadError) throw uploadError;

  // Save the uploaded photo URL.
  const publicUrl = `https://titcmdqlpvlqjhcculma.supabase.co/storage/v1/object/public/events/avatars/${event_id}/v${newVersion}`;
  const { error } = await supabase
    .from('events')
    .update({
      photo_url: publicUrl,
    })
    .match({ event_id });
  if (error) throw error;
  // Keep the previous photo until the replacement and its database reference are saved.
  if (listResData?.length) {
    await supabase.storage
      .from('events')
      .remove(listResData.map((file) => `avatars/${event_id}/${file.name}`));
  }
}

// only use when deleting an event, as this would otherwise conflict with CDN cache invalidation
export async function deleteEventFiles(event_id: string) {
  // check what files exist, if any
  const { data: list, error } = await supabase.storage.from('events').list(`avatars/${event_id}`);
  if (error) {
    console.error(error);
    return { error };
  }

  // Remove the event or account files.
  if (list?.length === 0 || !list) return { error: null, data: 'no files to delete' };
  const filesToRemove = list.map((f) => `avatars/${event_id}/${f.name}`);
  return await supabase.storage.from('events').remove(filesToRemove);
}
