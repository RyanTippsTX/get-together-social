import mitt from 'next/dist/shared/lib/mitt';
import supabase from '../lib/supabase';

export async function updateHostAvatar({
  host_id,
  avatarFile,
}: {
  host_id: string;
  avatarFile: File | null;
}) {
  // if no avatar file, wipe the avatar url from the host profile
  if (!avatarFile) {
    const { error } = await supabase
      .from('hosts')
      .update({
        avatar_url: null,
      })
      .match({ host_id });
  } else {
    // if there is an avatar file then:
    // check if there is a previously used avatar file
    const { data: listResData } = await supabase.storage.from('hosts').list(`avatars/${host_id}`, {
      limit: 1,
      offset: 0,
      sortBy: { column: 'name', order: 'desc' },
    });

    // if there is, then note its version & filename, then delete it
    let existingVersion: null | number = null;
    if (listResData?.length === 0) {
      // no existing version
      console.log('no existing version');

      // } else if (listResData![0].name === '.emptyFolderPlaceholder') {
      //   // still no existing version, but cleanup
      //   const { data, error } = await supabase.storage
      //     .from('hosts')
      //     .remove([`avatars/${host_id}/.emptyFolderPlaceholder`]); // cleanup
    } else {
      existingVersion = Number(listResData![0].name.slice(1));

      // get file name(s) so we can delete
      const { data: filesToDelete } = await supabase.storage
        .from('hosts')
        .list(`avatars/${host_id}/v${existingVersion}`);

      // delete the outdated file(s)
      const { data } = await supabase.storage
        .from('hosts')
        .remove(filesToDelete!.map((file) => `avatars/${host_id}/${file.name}`));
    }
    // upload new avatar at version/file
    const version = existingVersion ? existingVersion + 1 : 1;
    const { data: uploadResData, error } = await supabase.storage
      .from('hosts')
      .upload(`avatars/${host_id}/v${version}`, avatarFile, {
        // cacheControl: '3600', // one hour
        cacheControl: '31536000', // one year
        upsert: true, // only will matter in case of previous upload failure
      });
    console.log(uploadResData, error);

    // get url for new file
    if (uploadResData?.path) {
      const {
        data: { publicUrl },
      } = supabase.storage.from('hosts').getPublicUrl(uploadResData.path);
      // set url in host profile
      const { error } = await supabase
        .from('hosts')
        .update({
          avatar_url: publicUrl || null,
        })
        .match({ host_id });
    }
  }
}
