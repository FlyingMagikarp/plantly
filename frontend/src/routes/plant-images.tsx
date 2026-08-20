import { useState } from 'react';
import { Form, useActionData, useLoaderData, useNavigation } from 'react-router-dom';
import { BackLink, EmptyState, Page, PageHeader } from '../components/ui';
import type { ImageActionData, PlantImageItem, PlantImagesData } from './plant-images-data';

export function PlantImagesRoute() {
  const { plant, images } = useLoaderData<PlantImagesData>();
  const action = useActionData<ImageActionData>();
  const navigation = useNavigation();
  const [removing, setRemoving] = useState<PlantImageItem | null>(null);
  return <Page><BackLink to={`/plants/${plant.id}`}>{plant.nickname}</BackLink><PageHeader eyebrow="Plant images" title={plant.nickname} description="Images are shown newest first." />
    {action && <p className={`mt-4 text-sm ${action.ok ? 'text-green-700' : 'text-red-700'}`} role={action.ok ? 'status' : 'alert'}>{action.message}</p>}
    {plant.status === 'active' && <Form className="mt-6 flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-4 sm:flex-row sm:items-end" encType="multipart/form-data" method="post"><input name="intent" type="hidden" value="add-image" /><label className="grid flex-1 gap-1 text-sm font-medium">Add JPEG or PNG, up to 10 MB<input accept="image/jpeg,image/png" className="min-h-11 rounded-lg border border-neutral-300 p-2" name="image" required type="file" /></label><button className="btn-primary" disabled={navigation.state !== 'idle'} type="submit">{navigation.state === 'idle' ? 'Add image' : 'Adding…'}</button></Form>}
    {images.length === 0 ? <EmptyState description="Add an image to retain this plant’s appearance." title="No images yet" /> : <ul className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{images.map((image) => <li className="card overflow-hidden" key={image.id}><ImagePreview image={image} /><div className="flex items-center justify-between gap-3 p-3"><time className="text-sm text-neutral-600" dateTime={image.addedAt}>{new Date(image.addedAt).toLocaleString()}</time>{plant.status === 'active' && <button className="text-sm font-medium text-red-700" onClick={() => setRemoving(image)} type="button">Remove</button>}</div></li>)}</ul>}
    {removing && <div aria-modal="true" className="fixed inset-0 z-30 grid place-items-center bg-neutral-950/40 p-4" role="dialog"><section className="w-full max-w-md rounded-xl bg-white p-6"><h2 className="text-xl font-semibold">Permanently remove this image?</h2><p className="mt-3 text-neutral-600">This removes the selected image from {plant.nickname}. This cannot be undone.</p><div className="mt-6 flex justify-end gap-3"><button className="btn-secondary" onClick={() => setRemoving(null)} type="button">Cancel</button><Form method="post"><input name="intent" type="hidden" value="remove-image" /><input name="imageId" type="hidden" value={removing.id} /><button className="min-h-11 rounded-lg bg-red-700 px-4 font-medium text-white" type="submit">Permanently remove</button></Form></div></section></div>}
  </Page>;
}

function ImagePreview({ image }: { image: PlantImageItem }) { const [failed, setFailed] = useState(false); return failed ? <div className="grid aspect-square place-items-center bg-neutral-100 p-4 text-center text-sm text-neutral-600">Image unavailable</div> : <a href={image.contentUrl} target="_blank" rel="noreferrer"><img alt="Plant attachment" className="aspect-square w-full object-cover" onError={() => setFailed(true)} src={image.contentUrl} /></a>; }
