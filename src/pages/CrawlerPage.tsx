import { useState, useEffect } from 'react';
import { Plus, Globe, Trash2, RefreshCw, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCrawlerSites, useCrawlerMutations } from '@/hooks/useApi';

const addSiteSchema = z.object({
  url: z.string().url('Please enter a valid URL'),
  max_depth: z.number().min(1).max(3),
  max_pages: z.number().min(1).max(10000),
});

type AddSiteForm = z.infer<typeof addSiteSchema>;

export default function CrawlerPage() {
  const { sites, isLoading, isError, mutate } = useCrawlerSites();
  const { addSite, deleteSite, recrawlSite } = useCrawlerMutations();
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteSiteId, setDeleteSiteId] = useState<string | null>(null);
  const [recrawlingSiteId, setRecrawlingSiteId] = useState<string | null>(null);
  const [newlyAddedSiteId, setNewlyAddedSiteId] = useState<string | null>(null);

  const form = useForm<AddSiteForm>({
    resolver: zodResolver(addSiteSchema),
    defaultValues: {
      url: '',
      max_depth: 2,
      max_pages: 10,
    },
  });

  // Poll for status updates of newly added sites
  useEffect(() => {
    if (newlyAddedSiteId && sites) {
      const pollInterval = setInterval(() => {
        mutate(); // Refresh the sites list
        
        // Check if the site is completed
        const site = sites.find((s) => s.id === newlyAddedSiteId);
        if (site && site.status === 'completed') {
          setNewlyAddedSiteId(null);
          clearInterval(pollInterval);
        }
      }, 2000); // Poll every 2 seconds

      // Stop polling after 2 minutes
      const timeout = setTimeout(() => {
        setNewlyAddedSiteId(null);
        clearInterval(pollInterval);
      }, 120000);

      return () => {
        clearInterval(pollInterval);
        clearTimeout(timeout);
      };
    }
  }, [newlyAddedSiteId, sites, mutate]);

  const onSubmit = async (data: AddSiteForm) => {
    setIsSubmitting(true);
    try {
      const result = await addSite(data);
      if (result.id) {
        setNewlyAddedSiteId(result.id);
      }
      setIsAddOpen(false);
      form.reset();
      mutate(); // Immediately refresh to show the new site
    } catch (error) {
      console.error('Add site failed:', error);
      alert('Failed to add site. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteSiteId) return;
    
    try {
      await deleteSite(deleteSiteId);
      setDeleteSiteId(null);
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Delete failed. Please try again.');
    }
  };

  const handleRecrawl = async (siteId: string) => {
    setRecrawlingSiteId(siteId);
    try {
      await recrawlSite(siteId);
      setNewlyAddedSiteId(siteId); // Start polling for status updates
    } catch (error) {
      console.error('Recrawl failed:', error);
      alert('Recrawl failed. Please try again.');
    } finally {
      setRecrawlingSiteId(null);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not crawled';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string, siteId: string) => {
    const isPolling = newlyAddedSiteId === siteId;
    
    if (isPolling && status === 'processing') {
      return (
        <Badge variant="secondary" className="flex items-center gap-1">
          <Loader2 className="h-3 w-3 animate-spin" />
          Processing
        </Badge>
      );
    }
    
    return (
      <Badge variant={status === 'completed' ? 'default' : 'secondary'}>
        {status}
      </Badge>
    );
  };

  if (isError) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-red-600">Failed to load crawler sites. Please try again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Website Crawler</h1>
          <p className="text-muted-foreground">
            Add websites to crawl and index their content for AI processing
          </p>
        </div>
        
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Website
                </>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Website to Crawl</DialogTitle>
              <DialogDescription>
                Enter a website URL and crawl settings to index its content.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        The URL of the website to crawl
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="max_depth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Crawl Depth</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        defaultValue={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select depth" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">1 - Current page only</SelectItem>
                          <SelectItem value="2">2 - One level deep</SelectItem>
                          <SelectItem value="3">3 - Two levels deep</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        How deep to crawl into the website
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="max_pages"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Pages</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          max="10000"
                          placeholder="10"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                        />
                      </FormControl>
                      <FormDescription>
                        Maximum number of pages to crawl (1-10000)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddOpen(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      'Add Site'
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Sites Table */}
      <Card>
        <CardHeader>
          <CardTitle>Crawled Websites</CardTitle>
          <CardDescription>
            {sites?.length || 0} website(s) configured for crawling
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
            </div>
          ) : sites && sites.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>URL</TableHead>
                  <TableHead>Depth</TableHead>
                  <TableHead>Pages</TableHead>
                  <TableHead>Crawled At</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sites.map((site) => (
                  <TableRow key={site.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <Globe className="h-4 w-4 text-blue-600" />
                        <a
                          href={site.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline max-w-xs truncate"
                        >
                          {site.url}
                        </a>
                      </div>
                    </TableCell>
                    <TableCell>{site.max_depth || 1}</TableCell>
                    <TableCell>{site.pages_crawled || 0}</TableCell>
                    <TableCell>
                      {formatDate(site.last_crawled || site.created_at || '')}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(site.status || 'unknown', site.id || '')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRecrawl(site.id!)}
                          disabled={recrawlingSiteId === site.id || newlyAddedSiteId === site.id}
                        >
                          <RefreshCw className={`h-4 w-4 ${recrawlingSiteId === site.id ? 'animate-spin' : ''}`} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteSiteId(site.id!)}
                          disabled={newlyAddedSiteId === site.id}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <Globe className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium mb-2">No websites added</p>
              <p className="text-muted-foreground">
                Add your first website to start crawling
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteSiteId} onOpenChange={() => setDeleteSiteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Website</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this website? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 