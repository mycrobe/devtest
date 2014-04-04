#!/usr/bin/env perl
use strict;
use warnings;
use autodie;
use Data::Random qw(:all);

my ($customers_file, $sales_file, $parts_file) = @ARGV;

my $customers = load_file($customers_file);
my $sales = load_file($sales_file);
my $parts = load_file($parts_file);

my @orders;
for my $sp (@$sales) {
    my $n_orders = int rand(100)+1;
    for (my $i=0;$i<$n_orders;$i++) {
        my $tot=0;
        my $c = int rand(@$customers);
        my $n_parts = rand(5)+1;
        my @pq;
        for(my $j=0;$j<$n_parts;$j++) {
            my $p = int rand(@$parts);
            my $q = int rand(100)+1;
            push @pq, "$parts->[$p]{part_number}:$q";
            my $price = $parts->[$p]{retail_price};
            $price =~ s/\$//;
            $tot += $price*$q;
        }
        my $orderdate = rand_date(min => '2002-9-21', max => 'now');
        push @orders, [$orderdate,$sp->{name},$customers->[$c]{name},join(",",@pq),$tot];
    }
}

my $i=0;
print join ("\t", qw(order_number order_date sales_associate customer products/quantities total_sale)),"\n";
for my $order (sort by_date @orders) {
    $i++;
    my $orderNumber = sprintf("CHA-CHING-%07d", $i);
    print join ("\t", $orderNumber, @$order), "\n";
}

exit;

sub by_date {
    my @aYMD = $a->[0] =~ m/(\d+)-(\d+)-(\d+)/;
    my @bYMD = $b->[0] =~ m/(\d+)-(\d+)-(\d+)/;
    $aYMD[0] <=> $bYMD[0] or $aYMD[1] <=> $bYMD[1] or $aYMD[2] <=> $bYMD[2];
}

sub load_file {
    my $file = shift;
    open (my $fh, "<", $file);
    my $header = <$fh>;
    chomp $header;
    my @cols = split /\t/, $header;
    my @res;
    while (<$fh>) {
        chomp;
        my @x = split /\t/, $_;
        next if @x != @cols;
        my %h;
        for(my $i=0;$i<@x;$i++) {
            $h{$cols[$i]} = $x[$i];
        }
        push @res, \%h;
    }
    close $fh;
    print STDERR "load_file($file) ",scalar @res,"\n";
    return \@res;
}